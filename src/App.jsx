import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Upload, Scissors, FileText, Download, ChevronLeft, Plus, RefreshCw, X, Check, Loader, Folder, Trash2, AlertTriangle } from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────
const DM_LOGO_SRC = "data:image/png;base64,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TBstr/1rcBzHMIxRo0ax57jqEhH/dkSeDE6aNGnYsGGQLgAKN7Tpur5x48a+ffvyaTV+H1wsw6mpqU899ZT7FOYLnYAQonfv3qtXr772jV9ehoPn4cOH77///r1793LVRtHqlnuw46BBg1577TW/lPcUheviicO4cePGjh0brpMjAEIf4qWUx44d69GjR05OTnisl7tpz+XLl7/zzjsXRmqW6n/84x8zZswIb9EKdl1paWkPPfTQyZMn+XzzotItlihd1wcNGvTee+/53b8XyhjTdX3EiBFz5sy5HnobACEI8VLKfv367d69mw93D6dwoWnayy+/zGlA99bYja1YseKll166fpI3LF3btm3r2bPnRT1o4eiWuwl35MiR7733nn9XSgsRPmZG07S+ffteUa4WAPBbE8H3339//vz54bfBn6NlTk7Of//3f7thmmsOjx071qdPH64Xv07SV+xBDcNYtmzZSy+99LubuuRVdynDMMaOHfv6669f3Q7wcG19IUR2dvbjjz/O9SloEwCu2o7s2rVrxIgRl7nm4dN7XL58+eLFi7m2kKs2nn/++f3794eZv7x81/WPf/zjiy++uPS8/4oDqyuMn332GXcpbLkt0PS6rm/btm348OEefKQsAH6ZAtq2/fzzz585c8Z1J+HKqFGj8vLyiEjX9blz586ePZuPa7g+v3QhxHPPPZeenn4J13XFusVO61//+tczzzzDRZwIzReVrkmTJn311Vf+OkYMAC8ELyKKjIz86KOPVqxYEd62g3Oh27Ztmz9/vqZpx48fHzZsmAefjR4yuNDv8OHDzz///CXmK/JK35Sfp9KzZ89z586F/TzoWsaeUmrIkCHsTdEgAFxRnMnIyHj11Ve9fGZuIcYKIcTEiROFEK+++ur+/fuDyzSuz3m/pmkLFiyYNWvWb2UL5RW1r1KKd8wdOXIkXJPOhTWNMgzj559/njJlyo033ogGAeAynRbXvo8ePTojI4M3g4b35JgrBjds2DBx4sTPPvvsepDqy9TyESNGHD9+/KLuU15R+2qaNnTo0LVr16IW43JmDUKIkSNHPvroozCmAFyOzSKi//3f/+3ateu0adPC+HTTi4aLgQMHZmVl4YG0lH+qSFpa2t///veLCrm8/GblE3wnTpyIzUmXb0+zs7M3bdqE1gDgMv1Wdnb2ggULzp49e10dVO3K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";

const DM = {
  yellow: "#FFD900", black: "#111111", nearBlack: "#1A1A1A",
  grey600: "#555555", grey400: "#999999", grey200: "#D4D4D4",
  grey100: "#EEEEEE", grey50: "#F7F7F7", white: "#FFFFFF",
  red: "#DB2B39", yellowLight: "#FFF9DB", yellowMid: "#FFED6B",
  green: "#38A169",
};

const DEMO = false;
const API_URL_RESOLVED  = "https://dm-clip-platform-backend-production.up.railway.app";
const TEAM_PWD          = "dmresearch2025";

const hdrs = () => ({ "Content-Type": "application/json", "X-Team-Token": TEAM_PWD });

// ── Utility ──────────────────────────────────────────────────────────────────
function fmt(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return h > 0
    ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`
    : `${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

function toCSV(rows, cols) {
  const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = cols.map(c => c.label).join(",");
  const body = rows.map(r => cols.map(c => esc(r[c.key])).join(",")).join("\n");
  return header + "\n" + body;
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}

// ── Design system components ─────────────────────────────────────────────────
const DmLogo = ({ height = 22 }) => (
  <img src={DM_LOGO_SRC} alt="d+m" style={{ height: `${height}px`, display: "block" }} />
);

const Label = ({ children, style }) => (
  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, textTransform: "uppercase",
    letterSpacing: "0.06em", color: DM.grey400, ...style }}>{children}</span>
);

const Tag = ({ children, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px",
    borderRadius: 4, background: DM.grey100, fontFamily: "'Poppins', sans-serif",
    fontSize: 10, fontWeight: 500, color: DM.grey600, ...style }}>{children}</span>
);

const Btn = ({ children, active, onClick, style }) => (
  <button onClick={onClick} style={{
    padding: "7px 16px", borderRadius: 4, fontFamily: "'Poppins', sans-serif",
    fontSize: 11, fontWeight: 500,
    border: active ? `1.5px solid ${DM.yellow}` : "1.5px solid transparent",
    background: active ? DM.yellowLight : "transparent",
    color: active ? DM.black : DM.grey400, cursor: "pointer", transition: "all 0.15s", ...style
  }}>{children}</button>
);

const PrimaryBtn = ({ children, disabled, onClick, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "10px 20px", borderRadius: 4, fontFamily: "'Anton', sans-serif",
    fontSize: 13, border: "none",
    background: disabled ? DM.grey100 : DM.yellow,
    color: disabled ? DM.grey400 : DM.black,
    cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", ...style
  }}>{children}</button>
);

const SmallBtn = ({ children, onClick, icon: Icon, danger, style }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px",
    borderRadius: 4, border: `1px solid ${danger ? DM.red : DM.grey200}`,
    background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 10,
    fontWeight: 500, color: danger ? DM.red : DM.grey600, cursor: "pointer",
    transition: "all 0.15s", ...style
  }}>
    {Icon && <Icon size={11} />}{children}
  </button>
);

const Spinner = ({ size = 14, color = DM.yellow }) => (
  <div style={{ width: size, height: size, border: `2px solid ${DM.grey100}`,
    borderTopColor: color, borderRadius: "50%", animation: "spin 0.6s linear infinite",
    display: "inline-block" }} />
);

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    complete: { bg: "#E6F4EC", color: DM.green, label: "indexed" },
    processing: { bg: DM.yellowLight, color: "#B7860A", label: "processing" },
    pending: { bg: DM.grey50, color: DM.grey400, label: "pending" },
    failed: { bg: "#FEE8EA", color: DM.red, label: "failed" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ padding: "2px 7px", borderRadius: 3, fontSize: 9, fontWeight: 600,
      fontFamily: "'Space Mono', monospace", textTransform: "uppercase",
      background: s.bg, color: s.color }}>{s.label}</span>
  );
};

// ── Timecode warning badge ────────────────────────────────────────────────────
// Shown when avg quote duration > 2 min — signals loose/estimated timecodes
const TimecodeWarning = ({ avgQuoteMs }) => {
  const [tip, setTip] = useState(false);
  if (!avgQuoteMs || avgQuoteMs <= 120000) return null;
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 7px", borderRadius: 3, fontSize: 9, fontWeight: 600,
        fontFamily: "'Space Mono', monospace", textTransform: "uppercase",
        background: "#FFF3CD", color: "#856404", cursor: "default" }}>
        <AlertTriangle size={9} /> loose timecodes
      </span>
      {tip && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0,
          zIndex: 10, background: DM.black, color: DM.white, borderRadius: 4,
          padding: "8px 12px", width: 220,
          fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 300,
          lineHeight: 1.5, whiteSpace: "normal" }}>
          Average quote duration is {Math.round(avgQuoteMs / 1000)}s — transcript may lack
          per-line timecodes. Clip start points may need manual verification.
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// PROJECT SELECT SCREEN
// ────────────────────────────────────────────────────────────────────────────
function ProjectSelectScreen({ onSelect }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    if (DEMO) { setProjects(MOCK_PROJECTS); setLoading(false); return; }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects`, { headers: hdrs() });
      const d = await r.json();
      setProjects(d.projects || []);
    } catch (e) { setError("Could not connect to API."); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createProject = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects`, {
        method: "POST", headers: hdrs(), body: JSON.stringify({ name: newName.trim() })
      });
      const d = await r.json();
      if (d.project) { setProjects(p => [d.project, ...p]); setNewName(""); setShowCreate(false); }
    } catch {}
    setCreating(false);
  };

  return (
    <div style={{ height: "100vh", background: DM.white, display: "flex",
      flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ height: 54, display: "flex", alignItems: "center", gap: 14,
        padding: "0 24px", borderBottom: `1px solid ${DM.grey100}`, flexShrink: 0 }}>
        <DmLogo height={22} />
        <div style={{ width: 1, height: 22, background: DM.grey200 }} />
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 14,
          color: DM.black, letterSpacing: "0.02em" }}>CLIP EXPLORER</span>
        {DEMO && (
          <Tag style={{ background: DM.red, color: DM.white, fontSize: 9, padding: "2px 8px" }}>
            DEMO MODE
          </Tag>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 26,
                color: DM.black, marginBottom: 4 }}>SELECT PROJECT</h1>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12,
                color: DM.grey400, fontWeight: 300 }}>
                Choose a research engagement to open
              </p>
            </div>
            <SmallBtn icon={Plus} onClick={() => setShowCreate(s => !s)}>
              New project
            </SmallBtn>
          </div>

          {/* Create project inline */}
          {showCreate && (
            <div style={{ background: DM.grey50, border: `1.5px solid ${DM.yellow}`,
              borderRadius: 4, padding: "16px 20px", marginBottom: 20,
              display: "flex", gap: 10, alignItems: "center",
              animation: "fadeUp 0.15s ease" }}>
              <input
                autoFocus
                placeholder="Project name…"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createProject()}
                style={{ flex: 1, padding: "8px 12px", border: `1.5px solid ${DM.grey200}`,
                  borderRadius: 4, fontFamily: "'Poppins', sans-serif", fontSize: 12,
                  outline: "none" }}
              />
              <PrimaryBtn onClick={createProject} disabled={creating || !newName.trim()}
                style={{ padding: "8px 16px", fontSize: 11 }}>
                {creating ? "Creating…" : "Create"}
              </PrimaryBtn>
              <button onClick={() => setShowCreate(false)} style={{ background: "none",
                border: "none", cursor: "pointer", color: DM.grey400, padding: 4 }}>
                <X size={14} />
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Spinner size={24} />
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "#FEE8EA", borderRadius: 4,
              fontFamily: "'Poppins', sans-serif", fontSize: 12, color: DM.red }}>
              {error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px",
              fontFamily: "'Poppins', sans-serif", fontSize: 13,
              color: DM.grey400 }}>
              No projects yet. Create one above to get started.
            </div>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            {projects.map(p => (
              <div key={p.id} onClick={() => onSelect(p)}
                style={{ padding: "20px 24px", border: `1.5px solid ${DM.grey100}`,
                  borderRadius: 4, cursor: "pointer", background: DM.white,
                  transition: "all 0.15s", display: "flex",
                  alignItems: "center", justifyContent: "space-between",
                  animation: "fadeUp 0.2s ease" }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = DM.yellow;
                  e.currentTarget.style.background = DM.yellowLight;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = DM.grey100;
                  e.currentTarget.style.background = DM.white;
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4,
                    background: DM.yellow, display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Folder size={16} color={DM.black} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13,
                      fontWeight: 600, color: DM.black, marginBottom: 3 }}>
                      {p.name}
                    </div>
                    {p.description && (
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                        color: DM.grey400, fontWeight: 300 }}>{p.description}</div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center",
                  flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18,
                      color: DM.black }}>{p.indexed_count ?? 0}</div>
                    <Label>indexed</Label>
                  </div>
                  <div style={{ width: 1, height: 28, background: DM.grey100 }} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18,
                      color: DM.grey400 }}>{p.transcript_count ?? 0}</div>
                    <Label>transcripts</Label>
                  </div>
                  <div style={{ color: DM.grey200, marginLeft: 4 }}>›</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 28, fontFamily: "'Poppins', sans-serif", fontSize: 11,
            color: DM.grey400, textAlign: "center" }}>
            {new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SEARCH TAB
// ────────────────────────────────────────────────────────────────────────────
function SearchTab({ projectId, manifest, externalBasket, setExternalBasket }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const basket = externalBasket; const setBasket = setExternalBasket;
  const [basketMsg, setBasketMsg] = useState(null);
  const [filters, setFilters] = useState({ markets: [], segments: [] });

  const markets = [...new Set((manifest?.participants || []).map(p => p.market).filter(Boolean))];
  const segments = [...new Set((manifest?.participants || []).map(p => p.segment_name).filter(Boolean))];

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    if (DEMO) {
      await new Promise(r => setTimeout(r, 800));
      setResults(MOCK_RESULTS); setThemes(["value", "worth", "price", "cost"]);
      setLoading(false); return;
    }
    try {
      const body = { query, limit: 40, filters };
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/search`, {
        method: "POST", headers: hdrs(), body: JSON.stringify(body)
      });
      const d = await r.json();
      setResults(d.results || []);
      setThemes(d.expanded_themes || []);
    } catch {}
    setLoading(false);
  }, [query, projectId, filters]);

  const addToBasket = (quote) => {
    if (basket.find(b => b.quote_id === quote.quote_id)) return;
    setBasket(b => [...b, quote]);
    setBasketMsg(`Added — basket has ${basket.length + 1} clip${basket.length + 1 !== 1 ? "s" : ""}`);
    setTimeout(() => setBasketMsg(null), 2000);
  };

  const exportCSV = () => {
    const cols = [
      { key: "quote_id", label: "Quote ID" },
      { key: "verbatim_text", label: "Verbatim Text" },
      { key: "speaker", label: "Speaker" },
      { key: "start_fmt", label: "Start Timecode" },
      { key: "end_fmt", label: "End Timecode" },
      { key: "start_ms", label: "Start MS" },
      { key: "end_ms", label: "End MS" },
      { key: "participant_label", label: "Participant" },
      { key: "filename", label: "Source File" },
      { key: "context_before", label: "Context Before" },
      { key: "context_after", label: "Context After" },
    ];
    const rows = results.map(r => ({
      ...r, start_fmt: fmt(r.timecode?.start_ms), end_fmt: fmt(r.timecode?.end_ms),
      start_ms: r.timecode?.start_ms, end_ms: r.timecode?.end_ms,
      participant_label: r.source?.participant_label, filename: r.source?.filename,
      context_before: r.context?.before, context_after: r.context?.after,
    }));
    downloadCSV(toCSV(rows, cols), `search_results_${query.replace(/\s+/g,"_")}.csv`);
  };

  const highlight = (text) => {
    if (!query) return text;
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "gi");
    return text.split(re).map((p, i) =>
      re.test(p)
        ? <mark key={i} style={{ background: DM.yellow, padding: "0 2px",
            borderRadius: 2, color: DM.black }}>{p}</mark>
        : p
    );
  };

  const filterActive = filters.markets.length > 0 || filters.segments.length > 0;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: `1px solid ${DM.grey100}`,
        padding: 20, overflowY: "auto", flexShrink: 0 }}>
        <Label style={{ display: "block", marginBottom: 12 }}>Filters</Label>

        {markets.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
              fontWeight: 600, color: DM.grey600, marginBottom: 8 }}>Market</p>
            {markets.map(m => (
              <label key={m} style={{ display: "flex", alignItems: "center",
                gap: 7, marginBottom: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={filters.markets.includes(m)}
                  onChange={e => setFilters(f => ({
                    ...f, markets: e.target.checked
                      ? [...f.markets, m] : f.markets.filter(x => x !== m)
                  }))} />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.grey600 }}>{m}</span>
              </label>
            ))}
          </div>
        )}

        {segments.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
              fontWeight: 600, color: DM.grey600, marginBottom: 8 }}>Segment</p>
            {segments.map(s => (
              <label key={s} style={{ display: "flex", alignItems: "center",
                gap: 7, marginBottom: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={filters.segments.includes(s)}
                  onChange={e => setFilters(f => ({
                    ...f, segments: e.target.checked
                      ? [...f.segments, s] : f.segments.filter(x => x !== s)
                  }))} />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.grey600 }}>{s}</span>
              </label>
            ))}
          </div>
        )}

        {markets.length === 0 && segments.length === 0 && (
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
            color: DM.grey400, fontWeight: 300, lineHeight: 1.5 }}>
            Upload a participant manifest on the Transcripts tab to enable filters.
          </p>
        )}

        {filterActive && (
          <button onClick={() => setFilters({ markets: [], segments: [] })}
            style={{ marginTop: 8, background: "none", border: "none",
              fontFamily: "'Poppins', sans-serif", fontSize: 10,
              color: DM.grey400, cursor: "pointer", padding: 0 }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", display: "flex",
        flexDirection: "column" }}>
        {/* Search bar */}
        <div style={{ padding: "14px 24px", borderBottom: `1px solid ${DM.grey100}`,
          display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={12} style={{ position: "absolute", left: 12,
              top: "50%", transform: "translateY(-50%)", color: DM.grey400 }} />
            <input value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Search transcripts by keyword or concept…"
              style={{ width: "100%", padding: "9px 12px 9px 34px",
                border: `1.5px solid ${DM.grey200}`, borderRadius: 4,
                fontFamily: "'Poppins', sans-serif", fontSize: 12,
                outline: "none", boxSizing: "border-box" }} />
          </div>
          <PrimaryBtn onClick={search} disabled={loading || !query.trim()}
            style={{ padding: "9px 20px", fontSize: 12 }}>
            {loading ? <Spinner size={12} color={DM.black} /> : "Search"}
          </PrimaryBtn>
          {results.length > 0 && (
            <SmallBtn icon={Download} onClick={exportCSV}>Export CSV</SmallBtn>
          )}
        </div>

        {/* Themes */}
        {themes.length > 0 && (
          <div style={{ padding: "10px 24px", borderBottom: `1px solid ${DM.grey100}`,
            display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <Label style={{ marginRight: 4 }}>Concept expansion</Label>
            {themes.map(t => (
              <Tag key={t} style={{ background: DM.yellowLight, fontSize: 10 }}>{t}</Tag>
            ))}
          </div>
        )}

        {/* Basket toast */}
        {basketMsg && (
          <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100,
            background: DM.black, color: DM.white, padding: "10px 18px",
            borderRadius: 4, fontFamily: "'Poppins', sans-serif",
            fontSize: 12, animation: "fadeUp 0.2s ease",
            display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={12} color={DM.yellow} /> {basketMsg}
          </div>
        )}

        {/* Results */}
        <div style={{ padding: "20px 24px", flex: 1 }}>
          {!loading && results.length === 0 && query && (
            <div style={{ textAlign: "center", padding: "60px 20px",
              fontFamily: "'Poppins', sans-serif", fontSize: 13, color: DM.grey400 }}>
              No results found for "{query}"
            </div>
          )}
          {!loading && results.length === 0 && !query && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Search size={28} color={DM.grey200} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13,
                color: DM.grey400 }}>Enter a search to find verbatim quotes</p>
            </div>
          )}
          {results.length > 0 && (
            <div style={{ marginBottom: 14, display: "flex",
              justifyContent: "space-between", alignItems: "center" }}>
              <Label>{results.length} RESULT{results.length !== 1 ? "S" : ""}</Label>
              <Label>{basket.length} IN BASKET</Label>
            </div>
          )}
          {results.map((r, i) => (
            <QuoteCard key={r.quote_id} quote={r} index={i}
              inBasket={!!basket.find(b => b.quote_id === r.quote_id)}
              onAdd={addToBasket} highlight={highlight} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuoteCard({ quote, inBasket, onAdd, highlight }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ border: `1.5px solid ${DM.grey100}`, borderRadius: 4,
      marginBottom: 10, background: DM.white, overflow: "hidden",
      animation: "fadeUp 0.2s ease", transition: "border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = DM.grey200}
      onMouseLeave={e => e.currentTarget.style.borderColor = DM.grey100}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {quote.source?.participant_label && (
              <Tag>{quote.source.participant_label}</Tag>
            )}
            {quote.speaker && (
              <Tag style={{ background: DM.grey50 }}>{quote.speaker}</Tag>
            )}
            <Tag style={{ background: DM.grey50, fontFamily: "'Space Mono', monospace",
              fontSize: 9 }}>
              {fmt(quote.timecode?.start_ms)} → {fmt(quote.timecode?.end_ms)}
            </Tag>
          </div>
          <button
            onClick={() => onAdd(quote)}
            disabled={inBasket}
            style={{ padding: "5px 12px", borderRadius: 4, fontSize: 10,
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, cursor: inBasket ? "default" : "pointer",
              border: `1px solid ${inBasket ? DM.green : DM.yellow}`,
              background: inBasket ? "#E6F4EC" : DM.yellow,
              color: inBasket ? DM.green : DM.black,
              display: "flex", alignItems: "center", gap: 5,
              transition: "all 0.15s", flexShrink: 0, marginLeft: 12 }}>
            {inBasket ? <><Check size={10} /> Added</> : <><Scissors size={10} /> Add to basket</>}
          </button>
        </div>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12,
          fontWeight: 300, color: DM.nearBlack, lineHeight: 1.7,
          margin: 0 }}>
          "{highlight(quote.verbatim_text)}"
        </p>
      </div>
      {(quote.context?.before || quote.context?.after) && (
        <div style={{ borderTop: `1px solid ${DM.grey100}`, padding: "6px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setExpanded(e => !e)}
            style={{ background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontSize: 10,
              color: DM.grey400, padding: 0 }}>
            {expanded ? "Hide context" : "Show context"}
          </button>
          <Label>{quote.source?.filename}</Label>
        </div>
      )}
      {expanded && (
        <div style={{ padding: "10px 16px 14px", background: DM.grey50,
          borderTop: `1px solid ${DM.grey100}` }}>
          {quote.context?.before && (
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
              color: DM.grey400, fontWeight: 300, marginBottom: 6,
              fontStyle: "italic" }}>…{quote.context.before}</p>
          )}
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
            color: DM.grey600, fontWeight: 400, marginBottom: 6,
            borderLeft: `2px solid ${DM.yellow}`, paddingLeft: 8 }}>
            {quote.verbatim_text}
          </p>
          {quote.context?.after && (
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
              color: DM.grey400, fontWeight: 300, fontStyle: "italic" }}>
              {quote.context.after}…</p>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CLIP BASKET TAB — with per-clip timecode editing
// ────────────────────────────────────────────────────────────────────────────

// Parse "MM:SS" or "HH:MM:SS" string → milliseconds
function tcToMs(str) {
  if (!str) return 0;
  const parts = String(str).trim().split(':').map(Number);
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  return 0;
}

// Milliseconds → "MM:SS" or "HH:MM:SS" string for input display
function msToTcStr(ms) {
  const totalSec = Math.floor((ms || 0) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function BasketCard({ item, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [startStr, setStartStr] = useState(msToTcStr(item.timecode?.start_ms));
  const [endStr, setEndStr] = useState(msToTcStr(item.timecode?.end_ms));
  const [padding, setPadding] = useState(item._padding ?? 500);

  const applyEdit = () => {
    const start_ms = tcToMs(startStr);
    const end_ms   = tcToMs(endStr);
    if (end_ms > start_ms) {
      onUpdate({ timecode: { ...item.timecode, start_ms, end_ms }, _padding: padding });
    }
    setEditing(false);
  };

  const durationSec = Math.round(((item.timecode?.end_ms || 0) - (item.timecode?.start_ms || 0)) / 1000);

  return (
    <div style={{ border: `1.5px solid ${editing ? DM.yellow : DM.grey100}`, borderRadius: 4,
      marginBottom: 10, background: DM.white, overflow: 'hidden',
      transition: 'border-color 0.15s', animation: 'fadeUp 0.2s ease' }}>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {item.source?.participant_label && <Tag>{item.source.participant_label}</Tag>}
            {item._customLabel && <Tag style={{ background: DM.yellowLight }}>{item._customLabel}</Tag>}
            <Tag style={{ background: DM.grey50, fontFamily: "'Space Mono', monospace", fontSize: 9 }}>
              {fmt(item.timecode?.start_ms)} → {fmt(item.timecode?.end_ms)}
            </Tag>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: DM.grey400 }}>
              {durationSec}s
            </span>
            {item.source?.filename && (
              <Tag style={{ background: DM.grey50 }}>{item.source.filename}</Tag>
            )}
          </div>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 300,
            color: DM.nearBlack, lineHeight: 1.7, margin: 0 }}>
            {item._customLabel ? `Custom clip — ${item._customLabel}` : `"${item.verbatim_text}"`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => { setEditing(e => !e); setStartStr(msToTcStr(item.timecode?.start_ms)); setEndStr(msToTcStr(item.timecode?.end_ms)); }}
            style={{ background: editing ? DM.yellowLight : 'none',
              border: `1px solid ${editing ? DM.yellow : DM.grey200}`,
              borderRadius: 4, cursor: 'pointer', color: DM.grey600,
              padding: '4px 8px', fontFamily: "'Poppins', sans-serif",
              fontSize: 10, fontWeight: 500, transition: 'all 0.15s' }}>
            Edit clip
          </button>
          <button onClick={onRemove} style={{ background: 'none', border: 'none',
            cursor: 'pointer', color: DM.grey400, padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ padding: '12px 16px 16px', background: DM.grey50,
          borderTop: `1px solid ${DM.grey100}`, animation: 'fadeUp 0.15s ease' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Label style={{ display: 'block', marginBottom: 5 }}>Start timecode</Label>
              <input value={startStr} onChange={e => setStartStr(e.target.value)}
                placeholder="MM:SS or HH:MM:SS"
                style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${DM.grey200}`,
                  borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 11,
                  boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Label style={{ display: 'block', marginBottom: 5 }}>End timecode</Label>
              <input value={endStr} onChange={e => setEndStr(e.target.value)}
                placeholder="MM:SS or HH:MM:SS"
                style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${DM.grey200}`,
                  borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 11,
                  boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label style={{ display: 'block', marginBottom: 5 }}>Padding — {padding}ms</Label>
            <input type="range" min={0} max={2000} step={100} value={padding}
              onChange={e => setPadding(Number(e.target.value))}
              style={{ width: '100%', accentColor: DM.yellow }} />
            <div style={{ display: 'flex', justifyContent: 'space-between',
              fontFamily: "'Space Mono', monospace", fontSize: 9, color: DM.grey400 }}>
              <span>0ms</span><span>2000ms</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <PrimaryBtn onClick={applyEdit} style={{ padding: '7px 18px', fontSize: 11 }}>
              Apply
            </PrimaryBtn>
            <button onClick={() => setEditing(false)}
              style={{ padding: '7px 14px', borderRadius: 4, border: `1px solid ${DM.grey200}`,
                background: 'none', fontFamily: "'Poppins', sans-serif",
                fontSize: 11, color: DM.grey600, cursor: 'pointer' }}>
              Cancel
            </button>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9,
              color: DM.grey400, alignSelf: 'center', marginLeft: 4 }}>
              {tcToMs(endStr) > tcToMs(startStr)
                ? `${Math.round((tcToMs(endStr) - tcToMs(startStr)) / 1000)}s clip`
                : 'end must be after start'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function BasketTab({ projectId, basket, setBasket }) {
  const [outputFolder, setOutputFolder] = useState('/clips');
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const exportCSV = () => {
    const cols = [
      { key: 'quote_id', label: 'Quote ID' },
      { key: 'verbatim_text', label: 'Verbatim Text' },
      { key: 'speaker', label: 'Speaker' },
      { key: 'start_fmt', label: 'Start Timecode' },
      { key: 'end_fmt', label: 'End Timecode' },
      { key: 'participant_label', label: 'Participant' },
      { key: 'market', label: 'Market' },
      { key: 'segment', label: 'Segment' },
      { key: 'filename', label: 'Source File' },
    ];
    const rows = basket.map(r => ({
      ...r,
      start_fmt: fmt(r.timecode?.start_ms), end_fmt: fmt(r.timecode?.end_ms),
      participant_label: r.source?.participant_label, filename: r.source?.filename,
      market: r.source?.market ?? '', segment: r.source?.segment_name ?? '',
    }));
    downloadCSV(toCSV(rows, cols), `clip_basket_${Date.now()}.csv`);
  };

  const extract = async () => {
    setExtracting(true);
    if (DEMO) {
      await new Promise(r => setTimeout(r, 800));
      setJobId('demo-job-001');
      setJobStatus({ status: 'queued', clip_count: basket.length });
      setExtracting(false); return;
    }
    try {
      // Build clip specs — each item can have custom timecodes, padding, and label
      const clips = basket.map((b, i) => ({
        quote_id: b.quote_id,
        start_ms: b.timecode?.start_ms,
        end_ms: b.timecode?.end_ms,
        padding_ms: b._padding ?? 500,
        dropbox_video_path: b.source?.dropbox_video_path,
        label: b._customLabel || null,
        index: i + 1,
      }));
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/clips`, {
        method: 'POST', headers: hdrs(),
        body: JSON.stringify({ clips, output_folder: outputFolder })
      });
      const d = await r.json();
      setJobId(d.job_id);
      setJobStatus({ status: d.status, clip_count: d.clip_count });
      pollJob(d.job_id);
    } catch {}
    setExtracting(false);
  };

  const pollJob = useCallback(async (id) => {
    const poll = async () => {
      try {
        const r = await fetch(`${API_URL_RESOLVED}/api/clips/${id}`, { headers: hdrs() });
        const d = await r.json();
        setJobStatus(d.job);
        if (d.job.status === 'complete' || d.job.status === 'failed') return;
        setTimeout(poll, 3000);
      } catch {}
    };
    poll();
  }, []);

  const updateItem = (quoteId, updates) => {
    setBasket(b => b.map(item => item.quote_id === quoteId ? { ...item, ...updates } : item));
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
      {/* Quote list */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 16 }}>
          <Label>{basket.length} CLIP{basket.length !== 1 ? 'S' : ''} IN BASKET</Label>
          {basket.length > 0 && (
            <SmallBtn icon={Download} onClick={exportCSV}>Export CSV</SmallBtn>
          )}
        </div>

        {basket.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Scissors size={28} color={DM.grey200} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: DM.grey400 }}>
              Add quotes from Search, or create custom clips from the Transcripts tab
            </p>
          </div>
        )}

        {basket.map(item => (
          <BasketCard key={item.quote_id} item={item}
            onUpdate={updates => updateItem(item.quote_id, updates)}
            onRemove={() => setBasket(b => b.filter(x => x.quote_id !== item.quote_id))} />
        ))}
      </div>

      {/* Extraction controls */}
      {basket.length > 0 && (
        <div style={{ width: 240, borderLeft: `1px solid ${DM.grey100}`,
          padding: 20, flexShrink: 0, overflowY: 'auto' }}>
          <Label style={{ display: 'block', marginBottom: 16 }}>Extract Settings</Label>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
              fontWeight: 600, color: DM.grey600, marginBottom: 6 }}>
              Dropbox output folder
            </p>
            <input value={outputFolder} onChange={e => setOutputFolder(e.target.value)}
              placeholder="/Project Name/output-clips"
              style={{ width: '100%', padding: '8px 10px', border: `1.5px solid ${DM.grey200}`,
                borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 11,
                boxSizing: 'border-box', outline: 'none' }} />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 300,
              color: DM.grey400, marginTop: 5, lineHeight: 1.4 }}>
              Folder path inside your team Dropbox — not a URL.
            </p>
          </div>

          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 300,
            color: DM.grey400, marginBottom: 16, lineHeight: 1.5 }}>
            Per-clip timecodes and padding can be edited on each card in the basket.
          </p>

          <PrimaryBtn onClick={extract}
            disabled={extracting || basket.length === 0 || !!jobId}
            style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
            {extracting
              ? <><Spinner size={12} color={DM.black} /> Queuing…</>
              : `Extract ${basket.length} clip${basket.length !== 1 ? 's' : ''}`}
          </PrimaryBtn>

          {jobStatus && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: DM.grey50,
              borderRadius: 4, border: `1px solid ${DM.grey100}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6 }}>
                <Label>Job status</Label>
                <StatusBadge status={jobStatus.status} />
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9,
                color: DM.grey400, wordBreak: 'break-all' }}>{jobId}</p>
              {jobStatus.status === 'complete' && (
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.green, marginTop: 8 }}>
                  ✓ {jobStatus.clip_count} clips saved to Dropbox
                </p>
              )}
              {jobStatus.status === 'failed' && (
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.red, marginTop: 8 }}>
                  {jobStatus.error_message || 'Extraction failed'}
                </p>
              )}
            </div>
          )}

          {jobId && (
            <button onClick={() => { setJobId(null); setJobStatus(null); setBasket([]); }}
              style={{ marginTop: 12, width: '100%', background: 'none',
                border: `1px solid ${DM.grey200}`, borderRadius: 4,
                fontFamily: "'Poppins', sans-serif", fontSize: 10,
                color: DM.grey400, padding: '7px 0', cursor: 'pointer' }}>
              Clear basket &amp; start new
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TRANSCRIPTS TAB — with batch upload + pre-upload cleaning flow
// ────────────────────────────────────────────────────────────────────────────

// Validation helpers (run in browser before upload)
function detectTimecodes(text) {
  return /\d{1,2}:\d{2}(:\d{2})?(\.\d+)?(\s*-->)?/.test(text);
}
function detectInterviewer(text) {
  return /\bInterviewer\s*:/i.test(text);
}
function detectSpeakers(text) {
  const matches = text.match(/^([A-Z][A-Za-z0-9 .'-]{1,40})\s*:/gm) || [];
  const counts = {};
  matches.forEach(m => {
    const name = m.replace(/:$/, '').trim();
    counts[name] = (counts[name] || 0) + 1;
  });
  // Return speakers sorted by frequency
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}
function hasIdPrefix(filename) {
  // e.g. P01_, 001_, P01-, ICG01_ etc
  return /^[A-Za-z0-9]{2,6}[-_]/.test(filename);
}

// Per-file status
function validateFile(filename, text) {
  return {
    hasPrefix: hasIdPrefix(filename),
    hasTimecodes: detectTimecodes(text),
    hasInterviewer: detectInterviewer(text),
    speakers: detectSpeakers(text),
  };
}

function FileCleaningCard({ item, onUpdate, onRemove }) {
  const { file, text, filename, validation, cleaned } = item;
  const [idPrefix, setIdPrefix] = useState(filename.replace(/^([A-Za-z0-9]{2,6}[-_]).*/, '$1').replace(/[-_]$/, '') || '');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [applying, setApplying] = useState(false);

  const allGood = validation.hasPrefix && validation.hasTimecodes && validation.hasInterviewer;

  const applyPrefix = () => {
    if (!idPrefix.trim()) return;
    const newFilename = `${idPrefix.trim()}_${filename.replace(/^[A-Za-z0-9]{2,6}[-_]/, '')}`;
    onUpdate({ filename: newFilename, validation: { ...validation, hasPrefix: true } });
  };

  const applySpeaker = () => {
    if (!selectedSpeaker) return;
    setApplying(true);
    // Replace all occurrences of "SpeakerName:" at line start with "Interviewer:"
    const escaped = selectedSpeaker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newText = text.replace(new RegExp(`^${escaped}\\s*:`, 'gm'), 'Interviewer:');
    const newValidation = { ...validation, hasInterviewer: detectInterviewer(newText), speakers: detectSpeakers(newText) };
    onUpdate({ text: newText, validation: newValidation });
    setApplying(false);
  };

  return (
    <div style={{
      border: `1.5px solid ${allGood ? DM.green : (cleaned ? DM.yellow : '#FECACA')}`,
      borderRadius: 4, marginBottom: 10, overflow: 'hidden',
      background: allGood ? '#F0FFF4' : DM.white,
      transition: 'all 0.2s', animation: 'fadeUp 0.2s ease'
    }}>
      {/* File header */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: allGood ? 'none' : `1px solid ${DM.grey100}` }}>
        <FileText size={13} color={allGood ? DM.green : DM.grey400} style={{ flexShrink: 0 }} />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 500,
          color: DM.black, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {filename}
        </span>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <StatusPip ok={validation.hasPrefix} label="ID" />
          <StatusPip ok={validation.hasTimecodes} label="TC" />
          <StatusPip ok={validation.hasInterviewer} label="I:" />
        </div>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: DM.grey400, padding: 2, flexShrink: 0 }}>
          <X size={12} />
        </button>
      </div>

      {/* Fix panels — only shown if there's an issue */}
      {!allGood && (
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Fix: ID prefix */}
          {!validation.hasPrefix && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={11} color="#856404" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
                color: DM.grey600, flexShrink: 0 }}>Add ID prefix:</span>
              <input value={idPrefix} onChange={e => setIdPrefix(e.target.value)}
                placeholder="e.g. P01"
                style={{ width: 70, padding: '4px 8px', border: `1.5px solid ${DM.grey200}`,
                  borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 10,
                  outline: 'none' }} />
              <SmallBtn onClick={applyPrefix} style={{ padding: '4px 10px', fontSize: 10 }}>
                Apply
              </SmallBtn>
            </div>
          )}

          {/* Fix: Interviewer label */}
          {!validation.hasInterviewer && validation.speakers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <AlertTriangle size={11} color="#856404" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
                color: DM.grey600, flexShrink: 0 }}>Who is the interviewer?</span>
              <select value={selectedSpeaker} onChange={e => setSelectedSpeaker(e.target.value)}
                style={{ flex: 1, minWidth: 120, padding: '4px 8px',
                  border: `1.5px solid ${DM.grey200}`, borderRadius: 3,
                  fontFamily: "'Poppins', sans-serif", fontSize: 10, outline: 'none' }}>
                <option value="">Select speaker…</option>
                {validation.speakers.map(s => (
                  <option key={s.name} value={s.name}>{s.name} ({s.count} turns)</option>
                ))}
              </select>
              <SmallBtn onClick={applySpeaker} disabled={!selectedSpeaker || applying}
                style={{ padding: '4px 10px', fontSize: 10 }}>
                Replace with Interviewer:
              </SmallBtn>
            </div>
          )}

          {/* Block: No timecodes — can't auto-fix */}
          {!validation.hasTimecodes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              background: '#FEE8EA', borderRadius: 3 }}>
              <X size={11} color={DM.red} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: DM.red }}>
                No timecodes detected — this file must be fixed externally before uploading.
                Clips cannot be extracted without timecodes.
              </span>
            </div>
          )}
        </div>
      )}

      {/* All good */}
      {allGood && (
        <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={11} color={DM.green} />
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: DM.green }}>
            Ready to upload
          </span>
        </div>
      )}
    </div>
  );
}

const StatusPip = ({ ok, label }) => (
  <span style={{
    padding: '2px 5px', borderRadius: 3, fontSize: 9, fontWeight: 600,
    fontFamily: "'Space Mono', monospace",
    background: ok ? '#E6F4EC' : '#FEE8EA',
    color: ok ? DM.green : DM.red
  }}>{label}</span>
);

// ── CustomClipPicker ─────────────────────────────────────────────────────────
function CustomClipPicker({ transcript, onAdd, onClose }) {
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [label, setLabel] = useState('');
  const [padding, setPadding] = useState(500);
  const [error, setError] = useState('');

  const handleAdd = () => {
    const start_ms = tcToMs(startStr);
    const end_ms   = tcToMs(endStr);
    if (!startStr || !endStr) { setError('Both timecodes required'); return; }
    if (end_ms <= start_ms)   { setError('End must be after start'); return; }
    if (!transcript.dropbox_path) {
      setError('No video path set — add via manifest first');
      return;
    }
    const clip = {
      quote_id: `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      verbatim_text: '',
      _customLabel: label || `${transcript.participant_label || transcript.filename} ${startStr}–${endStr}`,
      _padding: padding,
      timecode: { start_ms, end_ms },
      source: {
        transcript_id: transcript.id,
        filename: transcript.filename,
        participant_label: transcript.participant_label,
        dropbox_video_path: transcript.dropbox_path,
        market: transcript.market,
        segment_name: transcript.segment_name,
      },
    };
    onAdd(clip);
  };

  const durationSec = startStr && endStr && tcToMs(endStr) > tcToMs(startStr)
    ? Math.round((tcToMs(endStr) - tcToMs(startStr)) / 1000) : null;

  return (
    <div style={{ marginTop: -2, marginBottom: 8, border: `1.5px solid ${DM.yellow}`,
      borderTop: 'none', borderRadius: '0 0 4px 4px',
      background: DM.yellowLight, padding: '14px 16px',
      animation: 'fadeUp 0.15s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 12,
          color: DM.black, letterSpacing: '0.02em' }}>CUSTOM CLIP</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none',
          cursor: 'pointer', color: DM.grey400, padding: 2 }}>
          <X size={13} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 100 }}>
          <Label style={{ display: 'block', marginBottom: 4 }}>Start</Label>
          <input value={startStr} onChange={e => { setStartStr(e.target.value); setError(''); }}
            placeholder="00:35:35"
            style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${DM.grey200}`,
              borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 11,
              boxSizing: 'border-box', outline: 'none', background: DM.white }} />
        </div>
        <div style={{ flex: 1, minWidth: 100 }}>
          <Label style={{ display: 'block', marginBottom: 4 }}>End</Label>
          <input value={endStr} onChange={e => { setEndStr(e.target.value); setError(''); }}
            placeholder="00:36:12"
            style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${DM.grey200}`,
              borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 11,
              boxSizing: 'border-box', outline: 'none', background: DM.white }} />
        </div>
        <div style={{ flex: 2, minWidth: 160 }}>
          <Label style={{ display: 'block', marginBottom: 4 }}>Label (optional)</Label>
          <input value={label} onChange={e => setLabel(e.target.value)}
            placeholder="e.g. Risk aversion section"
            style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${DM.grey200}`,
              borderRadius: 4, fontFamily: "'Poppins', sans-serif", fontSize: 11,
              boxSizing: 'border-box', outline: 'none', background: DM.white }} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Label style={{ display: 'block', marginBottom: 4 }}>Padding — {padding}ms</Label>
        <input type="range" min={0} max={2000} step={100} value={padding}
          onChange={e => setPadding(Number(e.target.value))}
          style={{ width: '100%', accentColor: DM.yellow }} />
      </div>
      {error && (
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
          color: DM.red, marginBottom: 8 }}>{error}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <PrimaryBtn onClick={handleAdd} style={{ padding: '7px 20px', fontSize: 11,
          display: 'flex', alignItems: 'center', gap: 6 }}>
          <Scissors size={11} /> Add to basket
        </PrimaryBtn>
        {durationSec && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9,
            color: DM.grey600 }}>{durationSec}s clip</span>
        )}
        {!transcript.dropbox_path && (
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
            color: '#856404' }}>⚠ No video path set</span>
        )}
      </div>
    </div>
  );
}

function TranscriptsTab({ projectId, transcripts, setTranscripts, onAddToBasket }) {
  const [queue, setQueue] = useState([]);          // files being cleaned/staged
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [indexing, setIndexing] = useState(false);
  const [batchStatus, setBatchStatus] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [clipPicker, setClipPicker] = useState(null); // transcript id with picker open

  // Manifest state
  const [manifestRows, setManifestRows] = useState(null);
  const [manifestCols, setManifestCols] = useState([]);
  const [matchPreview, setMatchPreview] = useState(null);
  const [manifestUploading, setManifestUploading] = useState(false);
  const [manifestDone, setManifestDone] = useState(false);

  const fileInputRef = useRef();
  const manifestRef = useRef();

  const refresh = async () => {
    if (DEMO) { setTranscripts(MOCK_TRANSCRIPTS); return; }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}`, { headers: hdrs() });
      const d = await r.json();
      setTranscripts(d.transcripts || []);
    } catch {}
  };

  // ── File selection → parse + validate ──────────────────────
  const onFilesSelected = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    if (!files.length) return;

    const newItems = await Promise.all(files.map(async (file) => {
      let text = '';
      try {
        if (file.name.toLowerCase().endsWith('.docx')) {
          // Use mammoth via CDN isn't available — read as binary and warn
          // We'll send to backend for text extraction preview isn't possible client-side
          // So we mark as "needs server parse" and skip client-side text checks
          return {
            id: Math.random().toString(36).slice(2),
            file, filename: file.name, text: null, serverParse: true,
            validation: { hasPrefix: hasIdPrefix(file.name), hasTimecodes: true, hasInterviewer: true, speakers: [] },
            cleaned: false,
          };
        } else {
          text = await file.text();
        }
      } catch {}
      const validation = validateFile(file.name, text);
      return {
        id: Math.random().toString(36).slice(2),
        file, filename: file.name, text, serverParse: false,
        validation, cleaned: false,
      };
    }));

    setQueue(q => [...q, ...newItems]);
  };

  const updateQueueItem = (id, updates) => {
    setQueue(q => q.map(item => item.id === id
      ? { ...item, ...updates, cleaned: true }
      : item
    ));
  };

  const removeQueueItem = (id) => {
    setQueue(q => q.filter(item => item.id !== id));
  };

  const readyItems = queue.filter(item =>
    item.validation.hasPrefix && item.validation.hasTimecodes && item.validation.hasInterviewer
  );
  const blockedItems = queue.filter(item =>
    !item.validation.hasPrefix || !item.validation.hasTimecodes || !item.validation.hasInterviewer
  );
  const allReady = queue.length > 0 && blockedItems.length === 0;

  // ── Upload all ready files ──────────────────────────────────
  const uploadAll = async () => {
    if (!allReady) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: queue.length });

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      try {
        const fd = new FormData();
        // If text was cleaned in browser, create new Blob with updated text
        const uploadFile = (item.text && item.text !== await item.file.text())
          ? new File([item.text], item.filename, { type: item.file.type })
          : new File([item.file], item.filename, { type: item.file.type });
        fd.append('transcript', uploadFile);
        await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/transcripts`, {
          method: 'POST', headers: { 'X-Team-Token': TEAM_PWD }, body: fd
        });
      } catch (err) {
        console.error(`Upload failed for ${item.filename}:`, err);
      }
      setUploadProgress({ done: i + 1, total: queue.length });
    }

    setQueue([]);
    setUploading(false);
    await refresh();
  };

  // ── Indexing ────────────────────────────────────────────────
  const indexAll = async () => {
    setIndexing(true);
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/index-all`, {
        method: 'POST', headers: hdrs()
      });
      const d = await r.json();
      setBatchStatus(d);
      pollBatch();
    } catch {}
  };

  const pollBatch = useCallback(async () => {
    const poll = async () => {
      try {
        const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/index-all`, { headers: hdrs() });
        const d = await r.json();
        setBatchStatus(d);
        await refresh();
        if (!d.finishedAt && (d.processing > 0 || d.queued > 0)) setTimeout(poll, 2500);
        else setIndexing(false);
      } catch {}
    };
    poll();
  }, [projectId]);

  // ── Delete ──────────────────────────────────────────────────
  const deleteTranscript = async (transcriptId) => {
    setDeleting(transcriptId);
    try {
      const r = await fetch(
        `${API_URL_RESOLVED}/api/projects/${projectId}/transcripts/${transcriptId}`,
        { method: 'DELETE', headers: hdrs() }
      );
      if (r.ok) setTranscripts(ts => ts.filter(t => t.id !== transcriptId));
    } catch {}
    setDeleting(null); setConfirmDelete(null);
  };

  // ── Excel manifest ──────────────────────────────────────────
  const downloadTemplate = () => {
    const cols = ['interview_id','participant_label','dropbox_path','market','segment','gender','age_band'];
    const instructions = [
      '# INSTRUCTIONS — delete these rows before uploading',
      '# interview_id: must match the start of each transcript filename e.g. P01 matches P01_Mario.docx',
      '# dropbox_path: full path from app folder root INCLUDING filename AND extension',
      '#   Extension is required — .mp4 .mov .avi .mkv etc',
      '#   Example: /HSBC/Cast/P01.mp4   or   /ProjectName/Videos/Interview 01.mov',
      '#   If the file is not .mp4 make sure you type the correct extension',
      '#   Leave blank if unknown — clips cannot be extracted until this is set',
    ].map(note => [note,'','','','','',''].join(','));
    const example = ['P01','Participant 01','/HSBC/Cast/P01.mp4','UK','Mass Affluent','Female','35-44'];
    const csv = cols.join(',') + '\n' + instructions.join('\n') + '\n' + example.join(',');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'participant_manifest_template.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  const parseExcelManifest = async (file) => {
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    if (!rows.length) return;
    setManifestCols(Object.keys(rows[0]));
    setManifestRows(rows);

    const preview = transcripts.map(t => {
      const norm = t.filename.toLowerCase()
        .replace(/\.(docx|txt|vtt)$/i, '')
        .replace(/[-_\s]+(transcript|interview|cleaned|final|copy)[-_\s]*/gi, ' ')
        .replace(/\s+/g, ' ').trim();
      let best = null, bestScore = 0;
      for (const row of rows) {
        const candidates = [String(row.interview_id || ''), String(row.participant_label || '')]
          .map(s => s.toLowerCase().trim()).filter(Boolean);
        for (const c of candidates) {
          if (c && norm.includes(c) && c.length > bestScore) {
            bestScore = c.length; best = row;
          }
        }
      }
      return { transcript: t, match: best, score: bestScore };
    });
    setMatchPreview(preview);
  };

  const confirmManifest = async () => {
    if (!manifestRows) return;
    setManifestUploading(true);
    try {
      const participants = manifestRows.map(row => {
        const standard = ['interview_id','participant_label','dropbox_path','market','segment','segment_code','segment_name','gender','age_band'];
        const custom = {};
        Object.keys(row).forEach(k => { if (!standard.includes(k.toLowerCase())) custom[k] = row[k]; });
        return {
          interview_id: String(row.interview_id || row['Interview ID'] || '').trim(),
          participant_label: String(row.participant_label || row.Participant || '').trim(),
          dropbox_path: String(row.dropbox_path || row['Dropbox Path'] || row.video_path || '').trim() || null,
          market: String(row.market || row.Market || '').trim() || null,
          segment_code: String(row.segment_code || '').trim() || null,
          segment_name: String(row.segment || row.segment_name || row.Segment || '').trim() || null,
          custom_fields: custom,
        };
      }).filter(p => p.interview_id);

      await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/manifest`, {
        method: 'POST', headers: hdrs(), body: JSON.stringify(participants)
      });

      for (const item of (matchPreview || [])) {
        if (!item.match || !item.transcript) continue;
        let dp = String(item.match.dropbox_path || item.match['Dropbox Path'] || '').trim();
        if (dp) {
          // Normalise: ensure leading slash
          if (!dp.startsWith('/')) dp = '/' + dp;
          // Ensure .mp4 extension if no extension present
          if (!/\.\w{2,4}$/.test(dp)) dp = dp + '.mp4';
          await fetch(
            `${API_URL_RESOLVED}/api/projects/${projectId}/transcripts/${item.transcript.id}/dropbox-path`,
            { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ dropbox_path: dp }) }
          );
        }
      }
      await refresh();
      setManifestDone(true);
    } catch (err) { console.error('manifest confirm error:', err); }
    setManifestUploading(false);
  };

  const pending = transcripts.filter(t => t.indexing_status === 'pending' || t.indexing_status === 'failed').length;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Left: transcript list ── */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Label>{transcripts.length} TRANSCRIPT{transcripts.length !== 1 ? 'S' : ''}</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <SmallBtn icon={RefreshCw} onClick={refresh}>Refresh</SmallBtn>
            {pending > 0 && (
              <SmallBtn icon={indexing ? Loader : Scissors} onClick={indexAll}
                style={{ borderColor: DM.yellow, color: DM.black, background: DM.yellow }}>
                {indexing ? 'Indexing…' : `Index all (${pending})`}
              </SmallBtn>
            )}
          </div>
        </div>

        {/* Batch indexing progress */}
        {batchStatus && (
          <div style={{ padding: '12px 16px', background: DM.yellowLight, borderRadius: 4,
            marginBottom: 16, border: `1px solid ${DM.yellow}`,
            fontFamily: "'Poppins', sans-serif", fontSize: 11, color: DM.black,
            display: 'flex', alignItems: 'center', gap: 8 }}>
            Batch indexing: {batchStatus.complete ?? 0}/{batchStatus.total ?? transcripts.length} complete
            {batchStatus.finishedAt && ' ✓'}
            {batchStatus.processing > 0 && <Spinner size={10} />}
          </div>
        )}

        {/* Manifest match preview */}
        {matchPreview && !manifestDone && (
          <div style={{ marginBottom: 20, border: `1.5px solid ${DM.yellow}`, borderRadius: 4,
            overflow: 'hidden', animation: 'fadeUp 0.2s ease' }}>
            <div style={{ padding: '12px 16px', background: DM.yellowLight,
              borderBottom: `1px solid ${DM.yellow}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, color: DM.black }}>
                  MANIFEST MATCH PREVIEW
                </span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.grey600, marginLeft: 10 }}>
                  {matchPreview.filter(m => m.match).length}/{matchPreview.length} matched
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setMatchPreview(null); setManifestRows(null); }}
                  style={{ background: 'none', border: `1px solid ${DM.grey200}`, borderRadius: 4,
                    fontFamily: "'Poppins', sans-serif", fontSize: 10, color: DM.grey600,
                    padding: '5px 10px', cursor: 'pointer' }}>Cancel</button>
                <PrimaryBtn onClick={confirmManifest} disabled={manifestUploading}
                  style={{ padding: '6px 16px', fontSize: 11 }}>
                  {manifestUploading ? <><Spinner size={11} color={DM.black} /> Applying…</> : 'Confirm & Apply'}
                </PrimaryBtn>
              </div>
            </div>
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {matchPreview.map((item, i) => (
                <div key={i} style={{ padding: '9px 16px',
                  borderBottom: i < matchPreview.length - 1 ? `1px solid ${DM.grey100}` : 'none',
                  display: 'flex', alignItems: 'center', gap: 10, background: DM.white }}>
                  <FileText size={11} color={DM.grey400} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontSize: 11,
                    color: DM.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.transcript.filename}
                  </div>
                  <span style={{ color: DM.grey400, fontSize: 12 }}>→</span>
                  {item.match ? (
                    <div style={{ flexShrink: 0, display: 'flex', gap: 4 }}>
                      <Tag style={{ background: '#E6F4EC', color: DM.green, fontSize: 10 }}>
                        {item.match.participant_label || item.match.interview_id}
                      </Tag>
                      {(item.match.market || item.match.Market) && (
                        <Tag style={{ fontSize: 10 }}>{item.match.market || item.match.Market}</Tag>
                      )}
                    </div>
                  ) : (
                    <Tag style={{ background: '#FEE8EA', color: DM.red, fontSize: 10, flexShrink: 0 }}>
                      No match
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {manifestDone && (
          <div style={{ padding: '12px 16px', background: '#E6F4EC', borderRadius: 4,
            marginBottom: 16, border: `1px solid ${DM.green}`,
            fontFamily: "'Poppins', sans-serif", fontSize: 11, color: DM.green,
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={12} /> Manifest applied — metadata and video paths updated
          </div>
        )}

        {/* Upload staging queue */}
        {queue.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Label>{readyItems.length}/{queue.length} FILES READY</Label>
              <div style={{ display: 'flex', gap: 8 }}>
                <SmallBtn onClick={() => setQueue([])} icon={X}>Clear all</SmallBtn>
                <PrimaryBtn onClick={uploadAll}
                  disabled={!allReady || uploading}
                  style={{ padding: '7px 18px', fontSize: 11 }}>
                  {uploading
                    ? <><Spinner size={11} color={DM.black} /> {uploadProgress.done}/{uploadProgress.total}</>
                    : `Upload ${queue.length} file${queue.length !== 1 ? 's' : ''}`}
                </PrimaryBtn>
              </div>
            </div>
            {blockedItems.length > 0 && (
              <div style={{ padding: '8px 12px', background: '#FEF9C3', borderRadius: 4,
                marginBottom: 10, fontFamily: "'Poppins', sans-serif", fontSize: 10,
                color: '#854D0E', border: '1px solid #FDE68A' }}>
                {blockedItems.length} file{blockedItems.length !== 1 ? 's' : ''} need fixing before upload
              </div>
            )}
            {queue.map(item => (
              <FileCleaningCard key={item.id} item={item}
                onUpdate={updates => updateQueueItem(item.id, updates)}
                onRemove={() => removeQueueItem(item.id)} />
            ))}
          </div>
        )}

        {/* Indexed transcripts list */}
        {transcripts.length === 0 && queue.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FileText size={28} color={DM.grey200} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: DM.grey400 }}>
              No transcripts yet
            </p>
          </div>
        )}

        {transcripts.map(t => (
          <div key={t.id} style={{ display: "contents" }}>
          <div style={{ border: `1.5px solid ${DM.grey100}`, borderRadius: 4,
            padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fadeUp 0.2s ease',
            background: confirmDelete === t.id ? '#FEF2F2' : DM.white,
            borderColor: confirmDelete === t.id ? '#FECACA' : DM.grey100,
            transition: 'all 0.15s' }}>
            <FileText size={14} color={DM.grey400} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 500,
                color: DM.black, marginBottom: 4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.filename}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {t.participant_label && <Label>{t.participant_label}</Label>}
                {t.market && <Label style={{ color: DM.grey600 }}>{t.market}</Label>}
                {t.segment_name && <Label style={{ color: DM.grey600 }}>{t.segment_name}</Label>}
                {t.dropbox_path && <Label style={{ color: DM.grey200 }}>{t.dropbox_path}</Label>}
                {t.quote_count !== undefined && <Label>{t.quote_count} quotes</Label>}
                <TimecodeWarning avgQuoteMs={t.avg_quote_ms} />
              </div>
            </div>
            {confirmDelete === t.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: DM.red }}>
                  Delete transcript + all quotes?
                </span>
                <button onClick={() => deleteTranscript(t.id)} disabled={deleting === t.id}
                  style={{ padding: '4px 10px', borderRadius: 3, border: `1px solid ${DM.red}`,
                    background: DM.red, color: DM.white, fontFamily: "'Poppins', sans-serif",
                    fontSize: 10, fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4 }}>
                  {deleting === t.id ? <Spinner size={9} color={DM.white} /> : null} Confirm
                </button>
                <button onClick={() => setConfirmDelete(null)}
                  style={{ padding: '4px 10px', borderRadius: 3, border: `1px solid ${DM.grey200}`,
                    background: 'none', fontFamily: "'Poppins', sans-serif",
                    fontSize: 10, color: DM.grey600, cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <StatusBadge status={t.indexing_status} />
                <button onClick={() => setClipPicker(p => p === t.id ? null : t.id)}
                  title="Create custom clip"
                  style={{ background: clipPicker === t.id ? DM.yellowLight : 'none',
                    border: `1px solid ${clipPicker === t.id ? DM.yellow : DM.grey200}`,
                    borderRadius: 4, cursor: 'pointer', color: clipPicker === t.id ? DM.black : DM.grey400,
                    padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: "'Poppins', sans-serif", fontSize: 10, transition: 'all 0.15s' }}>
                  <Scissors size={11} />
                </button>
                <button onClick={() => setConfirmDelete(t.id)} title="Delete transcript"
                  style={{ background: 'none', border: 'none', cursor: 'pointer',
                    color: DM.grey200, padding: 4, display: 'flex', alignItems: 'center',
                    transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = DM.red}
                  onMouseLeave={e => e.currentTarget.style.color = DM.grey200}>
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Custom clip picker — inline below transcript row */}
          {clipPicker === t.id && (
            <CustomClipPicker
              transcript={t}
              onAdd={(clip) => {
                onAddToBasket(clip);
                setClipPicker(null);
              }}
              onClose={() => setClipPicker(null)}
            />
          )}
          </div>
        ))}
      </div>

      {/* ── Right panel ── */}
      <div style={{ width: 260, borderLeft: `1px solid ${DM.grey100}`, padding: 20,
        flexShrink: 0, overflowY: 'auto' }}>

        {/* Manifest */}
        <Label style={{ display: 'block', marginBottom: 6 }}>Participant manifest</Label>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 300,
          color: DM.grey400, marginBottom: 12, lineHeight: 1.5 }}>
          Upload an Excel or CSV with participant metadata. Claude matches rows to transcripts automatically.
        </p>
        <SmallBtn icon={Download} onClick={downloadTemplate}
          style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
          Download template
        </SmallBtn>
        <input ref={manifestRef} type="file" accept=".xlsx,.xls,.csv" hidden
          onChange={async e => {
            const file = e.target.files[0];
            if (file) await parseExcelManifest(file);
            e.target.value = '';
          }} />
        <SmallBtn icon={Upload} onClick={() => manifestRef.current?.click()}
          style={{ width: '100%', marginBottom: 4, justifyContent: 'center',
            borderColor: manifestRows ? DM.green : DM.grey200,
            color: manifestRows ? DM.green : DM.grey600 }}>
          {manifestRows ? `${manifestRows.length} rows loaded` : 'Upload manifest (.xlsx / .csv)'}
        </SmallBtn>
        {manifestCols.length > 0 && (
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9,
            color: DM.grey400, marginTop: 6, lineHeight: 1.6 }}>
            COLUMNS: {manifestCols.join(', ')}
          </p>
        )}

        <div style={{ height: 1, background: DM.grey100, margin: '20px 0' }} />

        {/* Transcript upload */}
        <Label style={{ display: 'block', marginBottom: 8 }}>Upload transcripts</Label>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 300,
          color: DM.grey400, marginBottom: 12, lineHeight: 1.5 }}>
          Select one or more files. Each will be checked for ID prefix, timecodes, and Interviewer: label before uploading.
        </p>
        <input ref={fileInputRef} type="file" accept=".txt,.vtt,.docx" multiple hidden
          onChange={onFilesSelected} />
        <PrimaryBtn onClick={() => fileInputRef.current?.click()}
          style={{ width: '100%', fontSize: 11, padding: '9px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Upload size={12} /> Select files…
        </PrimaryBtn>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: DM.grey400,
          marginTop: 8, lineHeight: 1.5 }}>
          .TXT / .VTT / .DOCX — ANY QUANTITY
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ────────────────────────────────────────────────────────────────────────────
const MOCK_PROJECTS = [
  { id: "proj-1", name: "UK Grocery Shopper Study 2025", description: "15 in-depth interviews across 3 segments", transcript_count: 15, indexed_count: 12 },
  { id: "proj-2", name: "Financial Services Brand Perceptions", description: "8 participant dyads", transcript_count: 8, indexed_count: 8 },
  { id: "proj-3", name: "Gen Z Home Ownership Attitudes", description: null, transcript_count: 6, indexed_count: 0 },
];
const MOCK_TRANSCRIPTS = [
  { id: "t1", filename: "P01_interview.docx", participant_label: "P01", indexing_status: "complete", dropbox_path: "/videos/P01.mp4", indexed_at: "2025-03-10T12:00:00Z", quote_count: 84, avg_quote_ms: 45000 },
  { id: "t2", filename: "P02_interview.docx", participant_label: "P02", indexing_status: "complete", dropbox_path: "/videos/P02.mp4", indexed_at: "2025-03-10T12:15:00Z", quote_count: 91, avg_quote_ms: 38000 },
  { id: "t3", filename: "P03_loose_transcript.txt", participant_label: "P03", indexing_status: "complete", dropbox_path: null, indexed_at: null, quote_count: 12, avg_quote_ms: 185000 },
  { id: "t4", filename: "P04_interview.vtt", participant_label: "P04", indexing_status: "pending", dropbox_path: null, indexed_at: null, quote_count: 0, avg_quote_ms: null },
];
const MOCK_RESULTS = [
  { quote_id: "q1", verbatim_text: "I just want to feel like I'm getting value for money, you know? Like the price needs to match what I actually get out of it.", speaker: "Participant", timecode: { start_ms: 183000, end_ms: 201000 }, context: { before: "So when you think about switching brands…", after: "That's what matters most to me at the end of the day." }, source: { transcript_id: "t1", filename: "P01_interview.docx", participant_label: "P01", dropbox_video_path: "/videos/P01.mp4" } },
  { quote_id: "q2", verbatim_text: "The cost isn't even the main thing honestly, it's whether you trust them with your money. Once that trust breaks it's really hard to get back.", speaker: "Participant", timecode: { start_ms: 312000, end_ms: 334000 }, context: { before: "And how do you feel about the pricing changes?", after: "I've changed banks twice in the last three years." }, source: { transcript_id: "t2", filename: "P02_interview.docx", participant_label: "P02", dropbox_video_path: "/videos/P02.mp4" } },
];

// ────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("project-select");
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState("search");
  const [basket, setBasket] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [manifest, setManifest] = useState(null);

  const selectProject = async (p) => {
    setProject(p);
    setScreen("main");
    if (DEMO) { setTranscripts(MOCK_TRANSCRIPTS); return; }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${p.id}`, { headers: hdrs() });
      const d = await r.json();
      setTranscripts(d.transcripts || []);
      const mr = await fetch(`${API_URL_RESOLVED}/api/projects/${p.id}/manifest`, { headers: hdrs() });
      if (mr.ok) { const md = await mr.json(); setManifest(md); }
    } catch {}
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex",
      flexDirection: "column", background: DM.white,
      fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${DM.grey200}; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus, input:focus { border-color: ${DM.yellow} !important; outline: none; }
        input[type=range] { cursor: pointer; }
        input[type=checkbox] { accent-color: ${DM.yellow}; }
      `}</style>

      {screen === "project-select" && (
        <ProjectSelectScreen onSelect={selectProject} />
      )}

      {screen === "main" && project && (
        <>
          {/* Header */}
          <div style={{ height: 54, display: "flex", alignItems: "center",
            gap: 14, padding: "0 24px", borderBottom: `1px solid ${DM.grey100}`,
            flexShrink: 0 }}>
            <button onClick={() => { setScreen("project-select"); setProject(null); setBasket([]); }}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: DM.grey400, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
              <ChevronLeft size={14} />
            </button>
            <DmLogo height={22} />
            <div style={{ width: 1, height: 22, background: DM.grey200 }} />
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 14,
              color: DM.black, letterSpacing: "0.02em" }}>CLIP EXPLORER</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
              color: DM.grey400, fontWeight: 300 }}>— {project.name}</span>
            {DEMO && (
              <Tag style={{ background: DM.red, color: DM.white, fontSize: 9, padding: "2px 8px" }}>
                DEMO MODE
              </Tag>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              <Btn active={tab === "search"} onClick={() => setTab("search")}>
                Search
              </Btn>
              <Btn active={tab === "basket"} onClick={() => setTab("basket")}>
                Basket {basket.length > 0 && `(${basket.length})`}
              </Btn>
              <Btn active={tab === "transcripts"} onClick={() => setTab("transcripts")}>
                Transcripts
              </Btn>
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
            {tab === "search" && (
              <SearchTab projectId={project.id} manifest={manifest}
                externalBasket={basket} setExternalBasket={setBasket} />
            )}
            {tab === "basket" && (
              <BasketTab projectId={project.id}
                basket={basket} setBasket={setBasket} />
            )}
            {tab === "transcripts" && (
              <TranscriptsTab projectId={project.id}
                transcripts={transcripts} setTranscripts={setTranscripts}
                onAddToBasket={(clip) => { setBasket(b => [...b, clip]); setTab('basket'); }} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
