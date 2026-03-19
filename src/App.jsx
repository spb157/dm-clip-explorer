// ============================================================
// d+m Video Interview Clip Extraction Platform
// Express Backend — server.js
// ============================================================
//
// Environment variables required (set in Railway/Render dashboard):
//   DATABASE_URL      — PostgreSQL connection string
//   ANTHROPIC_API_KEY — Claude API key (for transcript indexing)
//   DROPBOX_APP_KEY   — Dropbox app key
//   DROPBOX_APP_SECRET
//   DROPBOX_REFRESH_TOKEN — long-lived refresh token for team account
//   TEAM_PASSWORD     — shared password for all researcher auth
//   PORT              — optional, defaults to 3001

import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import { Dropbox } from 'dropbox';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ── Database ──────────────────────────────────────────────────
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ── API clients ───────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getDropbox() {
  return new Dropbox({
    clientId: process.env.DROPBOX_APP_KEY,
    clientSecret: process.env.DROPBOX_APP_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
  });
}

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Shared password auth — simple, no per-user accounts
function requireAuth(req, res, next) {
  const token = req.headers['x-team-token'];
  const expected = createHash('sha256')
    .update(process.env.TEAM_PASSWORD || 'changeme')
    .digest('hex');
  if (!token || createHash('sha256').update(token).digest('hex') !== expected) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  next();
}

// ============================================================
// STAGE 1: PROJECT & TRANSCRIPT MANAGEMENT
// ============================================================

// ── POST /api/projects ────────────────────────────────────────
// Create a new project (research engagement).
// Body: { name: string, description?: string }
app.post('/api/projects', requireAuth, async (req, res) => {
  const { name, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description, created_at`,
      [name.trim(), description?.trim() || null]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error('create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// ── GET /api/projects ─────────────────────────────────────────
// List all projects, with transcript counts.
app.get('/api/projects', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.name, p.description, p.created_at,
        COUNT(t.id)::int AS transcript_count,
        COUNT(t.id) FILTER (WHERE t.indexing_status = 'complete')::int AS indexed_count
      FROM projects p
      LEFT JOIN transcripts t ON t.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json({ projects: result.rows });
  } catch (err) {
    console.error('list projects error:', err);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// ── GET /api/projects/:id ─────────────────────────────────────
app.get('/api/projects/:id', requireAuth, async (req, res) => {
  try {
    const project = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (!project.rows.length) return res.status(404).json({ error: 'Not found' });

    const transcripts = await pool.query(
      `SELECT
         t.id, t.filename, t.participant_label, t.interview_id,
         t.indexing_status, t.dropbox_path, t.duration_seconds, t.indexed_at,
         t.market, t.segment_code, t.segment_name,
         COUNT(q.id)::int AS quote_count,
         AVG(q.end_time_ms - q.start_time_ms)::float AS avg_quote_ms
       FROM transcripts t
       LEFT JOIN quotes q ON q.transcript_id = t.id
       WHERE t.project_id = $1
       GROUP BY t.id
       ORDER BY t.created_at`,
      [req.params.id]
    );

    res.json({ project: project.rows[0], transcripts: transcripts.rows });
  } catch (err) {
    console.error('get project error:', err);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// ── POST /api/projects/:id/transcripts ───────────────────────
// Upload a transcript file (.txt, .vtt, or .docx) and queue it for indexing.
// Form: multipart — field "transcript" (file), "participant_label" (text),
//       "dropbox_path" (text), "interview_id" (text)
app.post('/api/projects/:id/transcripts', requireAuth, upload.single('transcript'), async (req, res) => {
  const { participant_label, dropbox_path, interview_id } = req.body;

  if (!req.file) return res.status(400).json({ error: 'transcript file required' });

  let rawText;
  // Sanitise filename — fix mojibake from FormData encoding (e.g. â€" -> —)
  let cleanFilename;
  try {
    cleanFilename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
  } catch {
    cleanFilename = req.file.originalname;
  }
  const filename = cleanFilename.toLowerCase();

  try {
    if (filename.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = result.value;
    } else {
      rawText = req.file.buffer.toString('utf8');
    }
    // Strip null bytes and other control characters PostgreSQL rejects
    rawText = rawText
      .replace(/\0/g, '')                          // null bytes
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, '') // other control chars (keep \t \n \r)
      .trim();
  } catch (err) {
    console.error('file parse error:', err);
    return res.status(400).json({ error: 'Could not parse transcript file' });
  }

  try {
    // Look up manifest metadata by fuzzy-matching filename against all manifest rows.
    // This fires regardless of upload order — manifest-first or transcripts-first both work.
    let market = null, segment_code = null, segment_name = null;
    let resolved_label = participant_label || null;
    let resolved_dropbox_path = dropbox_path || null;

    const manifestRows = await pool.query(
      `SELECT * FROM participant_manifest WHERE project_id = $1`,
      [req.params.id]
    );

    if (manifestRows.rows.length > 0) {
      // Normalise filename the same way the frontend preview does
      const norm = cleanFilename.toLowerCase()
        .replace(/\.(docx|txt|vtt)$/i, '')
        .replace(/[-_\s]+(transcript|interview|cleaned|final|copy)[-_\s]*/gi, ' ')
        .replace(/\s+/g, ' ').trim();

      let bestMatch = null, bestScore = 0;
      for (const row of manifestRows.rows) {
        // Try full interview_id and participant_label, then individual words (min 3 chars)
        const fullCandidates = [
          String(row.interview_id || ''),
          String(row.participant_label || ''),
        ].map(s => s.toLowerCase().trim()).filter(Boolean);

        const wordCandidates = fullCandidates
          .flatMap(s => s.split(/[\s,_-]+/))
          .map(s => s.trim())
          .filter(s => s.length >= 3);

        for (const c of [...fullCandidates, ...wordCandidates]) {
          if (c && norm.includes(c) && c.length > bestScore) {
            bestScore = c.length;
            bestMatch = row;
          }
        }
      }

      if (bestMatch) {
        market         = bestMatch.market || null;
        segment_code   = bestMatch.segment_code || null;
        segment_name   = bestMatch.segment_name || null;
        resolved_label = resolved_label || bestMatch.participant_label || null;
        // Only set path from manifest if not explicitly provided in request
        if (!resolved_dropbox_path && bestMatch.dropbox_path) {
          let dp = bestMatch.dropbox_path.trim();
          if (!dp.startsWith('/')) dp = '/' + dp;
          if (!/\.\w{2,4}$/.test(dp)) dp = dp + '.mp4';
          resolved_dropbox_path = dp;
        }
        console.log(`Manifest match for "${cleanFilename}": ${bestMatch.interview_id} (score ${bestScore})`);
      } else {
        console.log(`No manifest match for "${cleanFilename}"`);
      }
    }

    const result = await pool.query(
      `INSERT INTO transcripts
         (project_id, filename, participant_label, interview_id, raw_text, dropbox_path,
          indexing_status, market, segment_code, segment_name)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, $8, $9)
       RETURNING id, filename, participant_label, interview_id, indexing_status, created_at`,
      [
        req.params.id,
        cleanFilename,
        resolved_label,
        interview_id || null,
        rawText,
        resolved_dropbox_path,
        market,
        segment_code,
        segment_name,
      ]
    );

    const transcript = result.rows[0];

    indexTranscript(transcript.id, rawText, req.params.id).catch(err =>
      console.error(`Indexing failed for ${transcript.id}:`, err)
    );

    res.status(201).json({
      transcript,
      message: 'Transcript uploaded. Indexing started.',
    });
  } catch (err) {
    console.error('upload transcript error:', err);
    res.status(500).json({ error: 'Failed to upload transcript' });
  }
});

// ── DELETE /api/projects/:id/transcripts/:transcriptId ───────
app.delete('/api/projects/:id/transcripts/:transcriptId', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM transcripts WHERE id = $1 AND project_id = $2 RETURNING id`,
      [req.params.transcriptId, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  } catch (err) {
    console.error('delete transcript error:', err);
    res.status(500).json({ error: 'Failed to delete transcript' });
  }
});


// ── GET /api/transcripts/:id/context ─────────────────────────
// Returns a window of raw transcript text around a timecode range.
// Query params: start_ms, end_ms, window_ms (default 120000 = 2 min each side)
app.get('/api/transcripts/:id/context', requireAuth, async (req, res) => {
  const { start_ms, end_ms, window_ms = 120000 } = req.query;
  try {
    const result = await pool.query(
      'SELECT raw_text FROM transcripts WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });

    const rawText = result.rows[0].raw_text;
    const lines = rawText.split(/\n/);

    // Parse timecodes from lines — find lines closest to our window
    const tcRegex = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/;
    const parsedLines = lines.map(line => {
      const m = tcRegex.exec(line);
      let ms = null;
      if (m) {
        const [, a, b, c] = m;
        ms = c
          ? (parseInt(a) * 3600 + parseInt(b) * 60 + parseInt(c)) * 1000
          : (parseInt(a) * 60 + parseInt(b)) * 1000;
      }
      return { line, ms };
    });

    const startMs = parseInt(start_ms) - parseInt(window_ms);
    const endMs = parseInt(end_ms) + parseInt(window_ms);

    // Find lines within the window — if no timecodes, estimate by line position
    let windowLines;
    const timedLines = parsedLines.filter(l => l.ms !== null);

    if (timedLines.length > 0) {
      // Use timecodes to find window
      let inWindow = false;
      windowLines = parsedLines.filter(l => {
        if (l.ms !== null) inWindow = l.ms >= startMs && l.ms <= endMs;
        return inWindow;
      });
    } else {
      // No timecodes — estimate by character position (130 wpm)
      const totalWords = rawText.split(/\s+/).length;
      const totalMs = totalWords * (60000 / 130);
      const startFrac = Math.max(0, startMs / totalMs);
      const endFrac = Math.min(1, endMs / totalMs);
      const startLine = Math.floor(startFrac * lines.length);
      const endLine = Math.ceil(endFrac * lines.length);
      windowLines = lines.slice(startLine, endLine).map(line => ({ line }));
    }

    res.json({
      context_text: windowLines.map(l => l.line).join('\n').trim(),
      start_ms: parseInt(start_ms),
      end_ms: parseInt(end_ms),
    });
  } catch (err) {
    console.error('context error:', err);
    res.status(500).json({ error: 'Failed to get context' });
  }
});

// ── GET /api/transcripts/:id/status ──────────────────────────
app.get('/api/transcripts/:id/status', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, filename, indexing_status, indexing_error, indexed_at,
              (SELECT COUNT(*) FROM quotes WHERE transcript_id = $1)::int AS quote_count
       FROM transcripts WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ transcript: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// ============================================================
// STAGE 2: SEARCH
// ============================================================

// ── POST /api/projects/:id/search ────────────────────────────
// Search indexed transcripts. Returns verbatim quotes with timecodes.
// Body: { query: string, limit?: number }
//
// Two-pass search:
//   Pass 1 — PostgreSQL full-text search (fast, keyword fallback)
//   Pass 2 — Claude concept expansion (finds semantically adjacent quotes)
app.post('/api/projects/:id/search', requireAuth, async (req, res) => {
  const { query, limit = 150 } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    // Pass 1: Full-text keyword search
    const keywordResults = await pool.query(
      `SELECT
         q.id, q.verbatim_text, q.speaker,
         q.start_time_ms, q.end_time_ms,
         q.context_before, q.context_after,
         t.id AS transcript_id,
         t.filename, t.participant_label,
         t.dropbox_path,
         ts_rank(to_tsvector('english', q.verbatim_text), plainto_tsquery('english', $1)) AS rank,
         'keyword' AS match_type
       FROM quotes q
       JOIN transcripts t ON t.id = q.transcript_id
       WHERE t.project_id = $2
         AND to_tsvector('english', q.verbatim_text) @@ plainto_tsquery('english', $1)
         AND (q.speaker IS NULL OR q.speaker NOT ILIKE ANY(ARRAY['interviewer%','moderator%','facilitator%','int%','mod%']))
       ORDER BY rank DESC
       LIMIT $3`,
      [query, req.params.id, limit]
    );

    // Pass 2: Concept expansion via Claude
    // Ask Claude which language themes are related to the query, then find quotes
    // tagged with those themes. This is navigation only — Claude does not interpret quotes.
    const expandedThemes = await expandQueryThemes(query);

    let conceptResults = { rows: [] };
    if (expandedThemes.length > 0) {
      conceptResults = await pool.query(
        `SELECT
           q.id, q.verbatim_text, q.speaker,
           q.start_time_ms, q.end_time_ms,
           q.context_before, q.context_after,
           t.id AS transcript_id,
           t.filename, t.participant_label,
           t.dropbox_path,
           0.5 AS rank,
           'concept' AS match_type
         FROM quotes q
         JOIN transcripts t ON t.id = q.transcript_id
         WHERE t.project_id = $1
           AND q.embedding_topics && $2::text[]
           AND (q.speaker IS NULL OR q.speaker NOT ILIKE ANY(ARRAY['interviewer%','moderator%','facilitator%','int%','mod%']))
         LIMIT $3`,
        [req.params.id, expandedThemes, limit]
      );
    }

    // Merge and deduplicate
    const seen = new Set();
    const merged = [...keywordResults.rows, ...conceptResults.rows]
      .filter(r => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      })
      .sort((a, b) => {
        if (a.match_type !== b.match_type) return a.match_type === 'keyword' ? -1 : 1;
        return b.rank - a.rank;
      })
      .slice(0, limit);

    res.json({
      query,
      expanded_themes: expandedThemes,        // transparent: show what Claude added
      result_count: merged.length,
      results: merged.map(r => ({
        quote_id: r.id,
        verbatim_text: r.verbatim_text,       // Layer 1: verbatim, never altered
        speaker: r.speaker,
        timecode: {
          start_ms: r.start_time_ms,
          end_ms: r.end_time_ms,
          start_formatted: formatTimecode(r.start_time_ms),
          end_formatted: formatTimecode(r.end_time_ms),
        },
        context: {
          before: r.context_before,
          after: r.context_after,
        },
        match_type: r.match_type,
        source: {
          transcript_id: r.transcript_id,
          filename: r.filename,
          participant_label: r.participant_label,
          dropbox_video_path: r.dropbox_path,
        },
      })),
    });
  } catch (err) {
    console.error('search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ============================================================
// STAGE 3: CLIP EXTRACTION
// ============================================================

// ── POST /api/projects/:id/clips ─────────────────────────────
// Submit a clip extraction job.
// Body: { clips: [{quote_id, start_ms, end_ms, padding_ms, dropbox_video_path}], output_folder }
// quote_id may be a real DB UUID or a custom_... ID from the timecode picker.
app.post('/api/projects/:id/clips', requireAuth, async (req, res) => {
  const { clips, output_folder } = req.body;

  if (!Array.isArray(clips) || clips.length === 0) {
    return res.status(400).json({ error: 'clips array required' });
  }
  if (!output_folder) {
    return res.status(400).json({ error: 'output_folder required (Dropbox path)' });
  }

  try {
    // Split DB quotes (real UUIDs) from custom clips (custom_... IDs)
    const dbSpecs = clips.filter(c => !String(c.quote_id).startsWith('custom_'));
    const customSpecs = clips.filter(c => String(c.quote_id).startsWith('custom_'));

    // Look up DB quotes to get dropbox_path + timecodes as fallback
    let dbRows = [];
    if (dbSpecs.length > 0) {
      const dbIds = dbSpecs.map(c => c.quote_id);
      const result = await pool.query(
        `SELECT q.id, q.start_time_ms, q.end_time_ms, t.dropbox_path, t.participant_label
         FROM quotes q
         JOIN transcripts t ON t.id = q.transcript_id
         WHERE q.id = ANY($1) AND q.project_id = $2`,
        [dbIds, req.params.id]
      );
      dbRows = result.rows;
    }

    // Resolve final clip specs — frontend timecodes take priority (researcher may have edited them)
    const resolvedClips = [
      ...dbSpecs.map(spec => {
        const row = dbRows.find(r => r.id === spec.quote_id) || {};
        return {
          id: spec.quote_id,
          start_time_ms: spec.start_ms ?? row.start_time_ms,
          end_time_ms: spec.end_ms ?? row.end_time_ms,
          padding_ms: spec.padding_ms ?? 500,
          dropbox_path: spec.dropbox_video_path || row.dropbox_path,
          participant_label: row.participant_label || null,
          label: spec.label || null,
          index: spec.index || null,
        };
      }),
      ...customSpecs.map(spec => ({
        id: spec.quote_id,
        start_time_ms: spec.start_ms,
        end_time_ms: spec.end_ms,
        padding_ms: spec.padding_ms ?? 500,
        dropbox_path: spec.dropbox_video_path,
        participant_label: null,
        label: spec.label || null,
        index: spec.index || null,
      })),
    ];

    // Store job — quote_ids column only accepts real UUIDs (schema constraint)
    const realUUIDs = dbRows.map(r => r.id);
    const result = await pool.query(
      `INSERT INTO clip_jobs (project_id, quote_ids, output_path, padding_ms)
       VALUES ($1, $2, $3, $4)
       RETURNING id, status, requested_at`,
      [req.params.id, realUUIDs, output_folder, 500]
    );

    const job = result.rows[0];

    // Start extraction asynchronously
    extractClips(job.id, resolvedClips, output_folder).catch(err =>
      console.error(`Clip extraction failed for job ${job.id}:`, err)
    );

    res.status(201).json({
      job_id: job.id,
      status: job.status,
      clip_count: clips.length,
      message: `Extraction queued. Check status at GET /api/clips/${job.id}`,
    });
  } catch (err) {
    console.error('clip job error:', err);
    res.status(500).json({ error: 'Failed to create clip job' });
  }
});

// ── GET /api/clips/:jobId ─────────────────────────────────────
app.get('/api/clips/:jobId', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, project_id, status, output_path, error_message,
              requested_at, started_at, completed_at,
              COALESCE(
                array_length(quote_ids, 1),
                0
              ) AS clip_count
       FROM clip_jobs WHERE id = $1`,
      [req.params.jobId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    // Normalise: treat complete_with_skips as complete for frontend badge
    const job = result.rows[0];
    if (job.status === 'complete_with_skips') job.status = 'complete';
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get job status' });
  }
});

// ── GET /api/projects/:id/clips ───────────────────────────────
// List all clip jobs for a project
app.get('/api/projects/:id/clips', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, status, output_path, requested_at, completed_at,
              array_length(quote_ids, 1) AS clip_count
       FROM clip_jobs WHERE project_id = $1 ORDER BY requested_at DESC`,
      [req.params.id]
    );
    res.json({ jobs: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

// ============================================================
// BACKGROUND WORKERS
// ============================================================

// ── Transcript Indexing ───────────────────────────────────────
// Processes a full transcript via Claude. 100% coverage guaranteed by
// chunking — every line gets processed.
//
// Claude's role here is Layer 2 (navigation) only:
//   - Extract verbatim quotes with timecodes
//   - Tag language themes for concept search
//   - No interpretation, no summarisation
async function indexTranscript(transcriptId, rawText, projectId) {
  await pool.query(
    'UPDATE transcripts SET indexing_status = $1 WHERE id = $2',
    ['processing', transcriptId]
  );

  try {
    // Split transcript into ~500-word chunks with overlap
    const chunks = chunkTranscript(rawText, 500, 50);
    console.log(`Indexing transcript ${transcriptId}: ${chunks.length} chunks`);

    for (const chunk of chunks) {
      const parsed = await extractQuotesFromChunk(chunk.text);

      // Store quotes
      for (const q of parsed.quotes) {
        await pool.query(
          `INSERT INTO quotes
             (transcript_id, project_id, speaker, verbatim_text,
              start_time_ms, end_time_ms, embedding_topics, context_before, context_after)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT DO NOTHING`,
          [
            transcriptId, projectId,
            q.speaker, q.verbatim_text,
            Math.round(q.start_time_ms), Math.round(q.end_time_ms),
            q.topics,
            q.context_before, q.context_after,
          ]
        );
      }

      // Store search index chunk
      await pool.query(
        `INSERT INTO search_index
           (transcript_id, project_id, chunk_text, chunk_start_ms, chunk_end_ms,
            language_themes, signal_flags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          transcriptId, projectId,
          chunk.text, Math.round(chunk.start_ms), Math.round(chunk.end_ms),
          parsed.language_themes,
          JSON.stringify(parsed.signal_flags),
        ]
      );
    }

    await pool.query(
      'UPDATE transcripts SET indexing_status = $1, indexed_at = NOW() WHERE id = $2',
      ['complete', transcriptId]
    );

    console.log(`Indexing complete for transcript ${transcriptId}`);
  } catch (err) {
    await pool.query(
      'UPDATE transcripts SET indexing_status = $1, indexing_error = $2 WHERE id = $3',
      ['failed', err.message, transcriptId]
    );
    throw err;
  }
}

// Claude API call — Layer 2 only. Extracts verbatim quotes + navigation metadata.
// System prompt encodes the thinking-partner relationship per d+m philosophy.
async function extractQuotesFromChunk(chunkText) {
  const systemPrompt = `You are a transcript processing assistant for a qualitative research firm.
Your job is to extract structured data from interview transcript chunks.

You operate at Layer 2 (Navigation) only. This means:
- Extract verbatim quotes exactly as spoken — never paraphrase, never alter a word
- ONLY extract quotes from research participants/interviewees — NEVER from the interviewer/moderator
- Speaker labels like "Interviewer:", "Moderator:", "Facilitator:", "Int:", "Mod:" indicate the researcher — skip these turns entirely
- Identify language themes (patterns in the words used) — not interpretations of meaning
- Flag signal patterns (e.g. extended response, hesitation, laughter)
- Never summarise. Never interpret. Never state what participants meant or felt.

Return ONLY valid JSON, no other text. Schema:
{
  "quotes": [
    {
      "speaker": "string or null",
      "verbatim_text": "exact words spoken",
      "start_time_ms": number,
      "end_time_ms": number,
      "topics": ["language theme 1", "language theme 2"],
      "context_before": "~30 words before this quote",
      "context_after": "~30 words after this quote"
    }
  ],
  "language_themes": ["theme present across this chunk"],
  "signal_flags": {
    "extended_response": boolean,
    "hesitation": boolean,
    "laughter": boolean,
    "strong_emotion": boolean,
    "contradiction": boolean
  }
}

Timecodes in the transcript appear as [HH:MM:SS] or [MM:SS] — convert to milliseconds.
If no timecodes are present, estimate based on average speech rate (~130 words/minute).`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: chunkText }],
  });

  const text = response.content.map(b => b.text || '').join('');
  const clean = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    console.warn('JSON parse failed for chunk, returning empty');
    return { quotes: [], language_themes: [], signal_flags: {} };
  }
}

// Layer 2: Ask Claude which language themes are conceptually adjacent to the query.
// This expands search without interpreting quotes.
async function expandQueryThemes(query) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: `You help expand search queries by identifying related language themes.
Return ONLY a JSON array of strings — related language themes a researcher might use
when searching for: "${query}". Focus on language patterns, not meanings.
Example: ["value", "cost", "price", "worth", "expense", "money"]
Return maximum 8 themes. Return ONLY the JSON array.`,
      messages: [{ role: 'user', content: query }],
    });

    const text = response.content.map(b => b.text || '').join('').trim();
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

// ── Clip Extraction ───────────────────────────────────────────
// clips: [{ id, start_time_ms, end_time_ms, padding_ms, dropbox_path }]
async function extractClips(jobId, clips, outputFolder) {
  await pool.query(
    'UPDATE clip_jobs SET status = $1, started_at = NOW() WHERE id = $2',
    ['processing', jobId]
  );

  let extractedCount = 0;
  let skippedCount = 0;

  try {
    const dbx = getDropbox();
    const tempDir = `/tmp/clips_${jobId}`;
    await fs.mkdir(tempDir, { recursive: true });

    for (const clip of clips) {
      if (!clip.dropbox_path) {
        console.warn(`No Dropbox path for clip ${clip.id}, skipping`);
        skippedCount++;
        continue;
      }

      // Normalise Dropbox path — ensure leading slash
      const dropboxPath = clip.dropbox_path.startsWith('/')
        ? clip.dropbox_path
        : '/' + clip.dropbox_path;

      const paddingMs = clip.padding_ms ?? 500;

      // Build a clean filename — use label if provided, otherwise fall back to timecode
      const safeLabel = clip.label
        ? clip.label.replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '_').slice(0, 60)
        : null;
      const indexPrefix = clip.index ? `${String(clip.index).padStart(2, '0')}_` : '';
      const clipName = safeLabel
        ? `${safeLabel}.mp4`
        : `${indexPrefix}clip_${formatTimecode(clip.start_time_ms).replace(/:/g, '-')}.mp4`;

      // Download video from Dropbox to temp
      const link = await dbx.filesGetTemporaryLink({ path: dropboxPath });
      const startSec = Math.max(0, (clip.start_time_ms - paddingMs) / 1000);
      const durationSec = (clip.end_time_ms - clip.start_time_ms + paddingMs * 2) / 1000;
      const clipPath = path.join(tempDir, clipName);

      // FFmpeg: seek to start, cut duration, re-encode for clean cut
      await execAsync(
        `ffmpeg -ss ${startSec} -i "${link.result.link}" -t ${durationSec} ` +
        `-c:v libx264 -c:a aac -avoid_negative_ts make_zero "${clipPath}" -y`
      );

      // Upload clip back to Dropbox output folder
      const clipBuffer = await fs.readFile(clipPath);
      await dbx.filesUpload({
        path: `${outputFolder}/${clipName}`,
        contents: clipBuffer,
        mode: { '.tag': 'overwrite' },
      });

      // Clean up temp file
      await fs.unlink(clipPath);
      extractedCount++;
    }

    await fs.rmdir(tempDir);

    // If every clip was skipped due to missing paths, mark as failed
    if (extractedCount === 0 && skippedCount > 0) {
      await pool.query(
        `UPDATE clip_jobs SET status = $1, error_message = $2, completed_at = NOW() WHERE id = $3`,
        ['failed', `All ${skippedCount} clip(s) had no Dropbox video path set — nothing extracted. Set video paths via the participant manifest.`, jobId]
      );
      return;
    }

    const finalStatus = skippedCount > 0 ? 'complete_with_skips' : 'complete';
    const finalMsg = skippedCount > 0
      ? `${extractedCount} clip(s) extracted. ${skippedCount} skipped (no video path).`
      : null;

    await pool.query(
      `UPDATE clip_jobs SET status = $1, error_message = $2, completed_at = NOW() WHERE id = $3`,
      [finalStatus, finalMsg, jobId]
    );
  } catch (err) {
    await pool.query(
      'UPDATE clip_jobs SET status = $1, error_message = $2 WHERE id = $3',
      ['failed', err.message, jobId]
    );
    throw err;
  }
}

// ============================================================
// UTILITIES
// ============================================================

// Split transcript into overlapping chunks
function chunkTranscript(text, wordsPerChunk, overlapWords) {
  const words = text.split(/\s+/);
  const chunks = [];
  const step = wordsPerChunk - overlapWords;

  // Extract overall start/end timecodes from the chunk text
  const tcRegex = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;

  for (let i = 0; i < words.length; i += step) {
    const slice = words.slice(i, i + wordsPerChunk);
    const chunkText = slice.join(' ');

    // Find first and last timecode in this chunk for metadata
    let firstMs = Math.round(i * (60000 / 130)); // fallback: estimate from word position
    let lastMs = Math.round((i + slice.length) * (60000 / 130));

    let match;
    const matches = [];
    const tempText = chunkText;
    const re = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;
    while ((match = re.exec(tempText)) !== null) {
      const [, a, b, c] = match;
      const ms = c
        ? (parseInt(a) * 3600 + parseInt(b) * 60 + parseInt(c)) * 1000
        : (parseInt(a) * 60 + parseInt(b)) * 1000;
      matches.push(ms);
    }
    if (matches.length > 0) {
      firstMs = matches[0];
      lastMs = matches[matches.length - 1];
    }

    chunks.push({ text: chunkText, start_ms: firstMs, end_ms: lastMs });

    if (i + wordsPerChunk >= words.length) break;
  }

  return chunks;
}

function formatTimecode(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Transcript reader — full raw text ─────────────────────────
app.get('/api/transcripts/:id/raw', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, filename, participant_label, dropbox_path, raw_text FROM transcripts WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ transcript: result.rows[0] });
  } catch (err) {
    console.error('GET /raw error:', err);
    res.status(500).json({ error: 'Failed to get transcript text' });
  }
});

// ── Health check ──────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`d+m clip platform running on port ${PORT}`));
