import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Upload, Scissors, FileText, Download, ChevronLeft, Plus, RefreshCw, X, Check, Loader, Folder } from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────
const DM_LOGO_SRC = "data:image/png;base64,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TBstr/1rcBzHMIxRo0ax57jqEhH/dkSeDE6aNGnYsGGQLgAKN7Tpur5x48a+ffvyaTV+H1wsw6mpqU899ZT7FOYLnYAQonfv3qtXr772jV9ehoPn4cOH77///r1793LVRtHqlnuw46BBg1577TW/lPcUheviicO4cePGjh0brpMjAEIf4qWUx44d69GjR05OTnisl7tpz+XLl7/zzjsXRmqW6n/84x8zZswIb9EKdl1paWkPPfTQyZMn+XzzotItlihd1wcNGvTee+/53b8XyhjTdX3EiBFz5sy5HnobACEI8VLKfv367d69mw93D6dwoWnayy+/zGlA99bYja1YseKll166fpI3LF3btm3r2bPnRT1o4eiWuwl35MiR7733nn9XSgsRPmZG07S+ffteUa4WAPBbE8H3339//vz54bfBn6NlTk7Of//3f7thmmsOjx071qdPH64Xv07SV+xBDcNYtmzZSy+99LubuuRVdynDMMaOHfv6669f3Q7wcG19IUR2dvbjjz/O9SloEwCu2o7s2rVrxIgRl7nm4dN7XL58+eLFi7m2kKs2nn/++f3794eZv7x81/WPf/zjiy++uPS8/4oDqyuMn332GXcpbLkt0PS6rm/btm348OEefKQsAH6ZAtq2/fzzz585c8Z1J+HKqFGj8vLyiEjX9blz586ePZuPa7g+v3QhxHPPPZeenn4J13XFusVO61//+tczzzzDRZwIzReVrkmTJn311Vf+OkYMAC8ELyKKjIz86KOPVqxYEd62g3Oh27Ztmz9/vqZpx48fHzZsmAefjR4yuNDv8OHDzz///CXmK/JK35Sfp9KzZ89z586F/TzoWsaeUmrIkCHsTdEgAFxRnMnIyHj11Ve9fGZuIcYKIcTEiROFEK+++ur+/fuDyzSuz3m/pmkLFiyYNWvWb2UL5RW1r1KKd8wdOXIkXJPOhTWNMgzj559/njJlyo033ogGAeAynRbXvo8ePTojI4M3g4b35JgrBjds2DBx4sTPPvvsepDqy9TyESNGHD9+/KLuU15R+2qaNnTo0LVr16IW43JmDUKIkSNHPvroozCmAFyOzSKi//3f/+3ateu0adPC+HTTi4aLgQMHZmVl4YG0lH+qSFpa2t///veLCrm8/GblE3wnTpyIzUmXb0+zs7M3bdqE1gDgMv1Wdnb2ggULzp49e10dVO3K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";

const DM = {
  yellow: "#FFD900", black: "#111111", nearBlack: "#1A1A1A",
  grey600: "#555555", grey400: "#999999", grey200: "#D4D4D4",
  grey100: "#EEEEEE", grey50: "#F7F7F7", white: "#FFFFFF",
  red: "#DB2B39", yellowLight: "#FFF9DB", yellowMid: "#FFED6B",
  green: "#38A169",
};

const DEMO = (typeof API_URL === "undefined") || API_URL === "https://your-app.railway.app";
const API_URL_RESOLVED  = (typeof API_URL !== "undefined") ? API_URL : "https://your-app.railway.app";
const TEAM_PWD          = (typeof TEAM_PASSWORD !== "undefined") ? TEAM_PASSWORD : "yourteampassword";

// Swap these three before deploying:
// const API_URL      = "https://your-app.railway.app";
// const TEAM_PASSWORD = "yourteampassword";

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
// CLIP BASKET TAB — receives shared basket state
// ────────────────────────────────────────────────────────────────────────────
function BasketTab({ projectId, basket, setBasket }) {
  const [outputFolder, setOutputFolder] = useState("/clips");
  const [paddingMs, setPaddingMs] = useState(500);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const exportCSV = () => {
    const cols = [
      { key: "quote_id", label: "Quote ID" },
      { key: "verbatim_text", label: "Verbatim Text" },
      { key: "speaker", label: "Speaker" },
      { key: "start_fmt", label: "Start Timecode" },
      { key: "end_fmt", label: "End Timecode" },
      { key: "participant_label", label: "Participant" },
      { key: "filename", label: "Source File" },
    ];
    const rows = basket.map(r => ({
      ...r, start_fmt: fmt(r.timecode?.start_ms), end_fmt: fmt(r.timecode?.end_ms),
      participant_label: r.source?.participant_label, filename: r.source?.filename,
    }));
    downloadCSV(toCSV(rows, cols), `clip_basket_${Date.now()}.csv`);
  };

  const extract = async () => {
    setExtracting(true);
    if (DEMO) {
      await new Promise(r => setTimeout(r, 800));
      setJobId("demo-job-001");
      setJobStatus({ status: "queued", clip_count: basket.length });
      setExtracting(false); return;
    }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/clips`, {
        method: "POST", headers: hdrs(),
        body: JSON.stringify({
          quote_ids: basket.map(b => b.quote_id),
          output_folder: outputFolder, padding_ms: paddingMs
        })
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
        if (d.job.status === "complete" || d.job.status === "failed") return;
        setTimeout(poll, 3000);
      } catch {}
    };
    poll();
  }, []);

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex" }}>
      {/* Quote list */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 16 }}>
          <Label>{basket.length} CLIP{basket.length !== 1 ? "S" : ""} IN BASKET</Label>
          {basket.length > 0 && (
            <SmallBtn icon={Download} onClick={exportCSV}>Export CSV</SmallBtn>
          )}
        </div>

        {basket.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Scissors size={28} color={DM.grey200} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13,
              color: DM.grey400 }}>
              Add quotes from the Search tab to queue clips for extraction
            </p>
          </div>
        )}

        {basket.map((r, i) => (
          <div key={r.quote_id} style={{ border: `1.5px solid ${DM.grey100}`,
            borderRadius: 4, padding: "14px 16px", marginBottom: 10,
            display: "flex", gap: 12, alignItems: "flex-start",
            animation: "fadeUp 0.2s ease" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                {r.source?.participant_label && <Tag>{r.source.participant_label}</Tag>}
                <Tag style={{ background: DM.grey50,
                  fontFamily: "'Space Mono', monospace", fontSize: 9 }}>
                  {fmt(r.timecode?.start_ms)} → {fmt(r.timecode?.end_ms)}
                </Tag>
                <Tag style={{ background: DM.grey50 }}>{r.source?.filename}</Tag>
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12,
                fontWeight: 300, color: DM.nearBlack, lineHeight: 1.7, margin: 0 }}>
                "{r.verbatim_text}"
              </p>
            </div>
            <button onClick={() => setBasket(b => b.filter(x => x.quote_id !== r.quote_id))}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: DM.grey400, padding: 4, flexShrink: 0 }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Extraction controls */}
      {basket.length > 0 && (
        <div style={{ width: 240, borderLeft: `1px solid ${DM.grey100}`,
          padding: 20, flexShrink: 0, overflowY: "auto" }}>
          <Label style={{ display: "block", marginBottom: 16 }}>Extract Settings</Label>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
              fontWeight: 600, color: DM.grey600, marginBottom: 6 }}>
              Dropbox output folder
            </p>
            <input value={outputFolder}
              onChange={e => setOutputFolder(e.target.value)}
              style={{ width: "100%", padding: "8px 10px",
                border: `1.5px solid ${DM.grey200}`, borderRadius: 4,
                fontFamily: "'Space Mono', monospace", fontSize: 11,
                boxSizing: "border-box", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
              fontWeight: 600, color: DM.grey600, marginBottom: 6 }}>
              Padding — {paddingMs}ms
            </p>
            <input type="range" min={0} max={2000} step={100}
              value={paddingMs} onChange={e => setPaddingMs(Number(e.target.value))}
              style={{ width: "100%", accentColor: DM.yellow }} />
            <div style={{ display: "flex", justifyContent: "space-between",
              fontFamily: "'Space Mono', monospace", fontSize: 9, color: DM.grey400 }}>
              <span>0ms</span><span>2000ms</span>
            </div>
          </div>

          <PrimaryBtn onClick={extract}
            disabled={extracting || basket.length === 0 || !!jobId}
            style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>
            {extracting
              ? <><Spinner size={12} color={DM.black} /> Queuing…</>
              : `Extract ${basket.length} clip${basket.length !== 1 ? "s" : ""}`}
          </PrimaryBtn>

          {jobStatus && (
            <div style={{ marginTop: 16, padding: "12px 14px",
              background: DM.grey50, borderRadius: 4, border: `1px solid ${DM.grey100}` }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 6 }}>
                <Label>Job status</Label>
                <StatusBadge status={jobStatus.status} />
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9,
                color: DM.grey400, wordBreak: "break-all" }}>{jobId}</p>
              {jobStatus.status === "complete" && (
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.green, marginTop: 8 }}>
                  ✓ {jobStatus.clip_count} clips saved to Dropbox
                </p>
              )}
              {jobStatus.status === "failed" && (
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11,
                  color: DM.red, marginTop: 8 }}>
                  {jobStatus.error_message || "Extraction failed"}
                </p>
              )}
            </div>
          )}

          {jobId && (
            <button onClick={() => { setJobId(null); setJobStatus(null); setBasket([]); }}
              style={{ marginTop: 12, width: "100%", background: "none",
                border: `1px solid ${DM.grey200}`, borderRadius: 4,
                fontFamily: "'Poppins', sans-serif", fontSize: 10,
                color: DM.grey400, padding: "7px 0", cursor: "pointer" }}>
              Clear basket &amp; start new
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TRANSCRIPTS TAB
// ────────────────────────────────────────────────────────────────────────────
function TranscriptsTab({ projectId, transcripts, setTranscripts }) {
  const [uploading, setUploading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [batchStatus, setBatchStatus] = useState(null);
  const fileRef = useRef();
  const manifestRef = useRef();
  const [participantLabel, setParticipantLabel] = useState("");
  const [dropboxPath, setDropboxPath] = useState("");

  const refresh = async () => {
    if (DEMO) { setTranscripts(MOCK_TRANSCRIPTS); return; }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}`, { headers: hdrs() });
      const d = await r.json();
      setTranscripts(d.transcripts || []);
    } catch {}
  };

  const uploadTranscript = async (file) => {
    if (!file) return;
    setUploading(true);
    if (DEMO) {
      await new Promise(r => setTimeout(r, 1000));
      setTranscripts(t => [...t, {
        id: `demo-${Date.now()}`, filename: file.name,
        participant_label: participantLabel || null,
        indexing_status: "pending", dropbox_path: dropboxPath || null,
        indexed_at: null
      }]);
      setUploading(false); setParticipantLabel(""); setDropboxPath(""); return;
    }
    const fd = new FormData();
    fd.append("transcript", file);
    if (participantLabel) fd.append("participant_label", participantLabel);
    if (dropboxPath) fd.append("dropbox_path", dropboxPath);
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/transcripts`, {
        method: "POST",
        headers: { "X-Team-Token": TEAM_PWD },
        body: fd
      });
      const d = await r.json();
      if (d.transcript) setTranscripts(t => [...t, d.transcript]);
    } catch {}
    setUploading(false); setParticipantLabel(""); setDropboxPath("");
  };

  const uploadManifest = async (file) => {
    if (!file) return;
    if (DEMO) { alert("DEMO MODE: manifest upload disabled"); return; }
    const text = await file.text();
    try {
      JSON.parse(text); // validate
    } catch { alert("Invalid JSON"); return; }
    try {
      await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/manifest`, {
        method: "POST", headers: hdrs(), body: text
      });
      refresh();
    } catch {}
  };

  const indexAll = async () => {
    setIndexing(true);
    if (DEMO) {
      await new Promise(r => setTimeout(r, 800));
      setBatchStatus({ total: transcripts.length, complete: 0, processing: transcripts.length });
      setTimeout(() => {
        setBatchStatus({ total: transcripts.length, complete: transcripts.length, processing: 0 });
        setIndexing(false);
      }, 3000);
      return;
    }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/index-all`, {
        method: "POST", headers: hdrs()
      });
      const d = await r.json();
      setBatchStatus(d);
      pollBatch();
    } catch {}
  };

  const pollBatch = useCallback(async () => {
    const poll = async () => {
      try {
        const r = await fetch(`${API_URL_RESOLVED}/api/projects/${projectId}/index-all`,
          { headers: hdrs() });
        const d = await r.json();
        setBatchStatus(d);
        await refresh();
        if (!d.finishedAt && (d.processing > 0 || d.queued > 0)) setTimeout(poll, 2500);
        else setIndexing(false);
      } catch {}
    };
    poll();
  }, [projectId]);

  const pending = transcripts.filter(t => t.indexing_status === "pending" || t.indexing_status === "failed").length;

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Transcript list */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 16 }}>
          <Label>{transcripts.length} TRANSCRIPT{transcripts.length !== 1 ? "S" : ""}</Label>
          <div style={{ display: "flex", gap: 8 }}>
            <SmallBtn icon={RefreshCw} onClick={refresh}>Refresh</SmallBtn>
            {pending > 0 && (
              <SmallBtn icon={indexing ? Loader : Scissors}
                onClick={indexAll}
                style={{ borderColor: DM.yellow, color: DM.black,
                  background: DM.yellow }}>
                {indexing ? `Indexing…` : `Index all (${pending})`}
              </SmallBtn>
            )}
          </div>
        </div>

        {batchStatus && (
          <div style={{ padding: "12px 16px", background: DM.yellowLight,
            borderRadius: 4, marginBottom: 16, border: `1px solid ${DM.yellow}`,
            fontFamily: "'Poppins', sans-serif", fontSize: 11, color: DM.black }}>
            Batch indexing: {batchStatus.complete ?? 0}/{batchStatus.total ?? transcripts.length} complete
            {batchStatus.finishedAt && " ✓"}
            {batchStatus.processing > 0 && <Spinner size={10} style={{ marginLeft: 8 }} />}
          </div>
        )}

        {transcripts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <FileText size={28} color={DM.grey200} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13,
              color: DM.grey400 }}>No transcripts yet</p>
          </div>
        )}

        {transcripts.map(t => (
          <div key={t.id} style={{ border: `1.5px solid ${DM.grey100}`,
            borderRadius: 4, padding: "12px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 12,
            animation: "fadeUp 0.2s ease" }}>
            <FileText size={14} color={DM.grey400} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12,
                fontWeight: 500, color: DM.black, marginBottom: 2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.filename}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {t.participant_label && (
                  <Label>{t.participant_label}</Label>
                )}
                {t.dropbox_path && (
                  <Label style={{ color: DM.grey200 }}>{t.dropbox_path}</Label>
                )}
                {t.quote_count !== undefined && (
                  <Label>{t.quote_count} quotes</Label>
                )}
              </div>
            </div>
            <StatusBadge status={t.indexing_status} />
          </div>
        ))}
      </div>

      {/* Upload panel */}
      <div style={{ width: 240, borderLeft: `1px solid ${DM.grey100}`,
        padding: 20, flexShrink: 0, overflowY: "auto" }}>

        {/* Transcript upload */}
        <Label style={{ display: "block", marginBottom: 12 }}>Upload transcript</Label>

        <div style={{ marginBottom: 10 }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
            fontWeight: 600, color: DM.grey600, marginBottom: 5 }}>
            Participant label
          </p>
          <input placeholder="e.g. P01" value={participantLabel}
            onChange={e => setParticipantLabel(e.target.value)}
            style={{ width: "100%", padding: "7px 10px",
              border: `1.5px solid ${DM.grey200}`, borderRadius: 4,
              fontFamily: "'Poppins', sans-serif", fontSize: 11,
              boxSizing: "border-box", outline: "none" }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10,
            fontWeight: 600, color: DM.grey600, marginBottom: 5 }}>
            Dropbox video path (optional)
          </p>
          <input placeholder="/videos/interview.mp4" value={dropboxPath}
            onChange={e => setDropboxPath(e.target.value)}
            style={{ width: "100%", padding: "7px 10px",
              border: `1.5px solid ${DM.grey200}`, borderRadius: 4,
              fontFamily: "'Space Mono', monospace", fontSize: 10,
              boxSizing: "border-box", outline: "none" }} />
        </div>

        <input ref={fileRef} type="file" accept=".txt,.vtt,.docx" hidden
          onChange={e => uploadTranscript(e.target.files[0])} />
        <PrimaryBtn onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ width: "100%", fontSize: 11, padding: "9px 0",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {uploading ? <><Spinner size={12} color={DM.black} /> Uploading…</> : <><Upload size={12} /> Upload .txt / .vtt / .docx</>}
        </PrimaryBtn>

        <div style={{ height: 1, background: DM.grey100, margin: "20px 0" }} />

        {/* Manifest upload */}
        <Label style={{ display: "block", marginBottom: 12 }}>Participant manifest</Label>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 300,
          color: DM.grey400, marginBottom: 12, lineHeight: 1.5 }}>
          Upload participant_manifest.json to enable demographic filters.
        </p>
        <input ref={manifestRef} type="file" accept=".json" hidden
          onChange={e => uploadManifest(e.target.files[0])} />
        <SmallBtn icon={Upload} onClick={() => manifestRef.current?.click()}
          style={{ width: "100%" }}>
          Upload manifest.json
        </SmallBtn>
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
  { id: "t1", filename: "P01_interview.docx", participant_label: "P01", indexing_status: "complete", dropbox_path: "/videos/P01.mp4", indexed_at: "2025-03-10T12:00:00Z", quote_count: 84 },
  { id: "t2", filename: "P02_interview.docx", participant_label: "P02", indexing_status: "complete", dropbox_path: "/videos/P02.mp4", indexed_at: "2025-03-10T12:15:00Z", quote_count: 91 },
  { id: "t3", filename: "P03_interview.txt",  participant_label: "P03", indexing_status: "processing", dropbox_path: null, indexed_at: null, quote_count: 0 },
  { id: "t4", filename: "P04_interview.vtt",  participant_label: "P04", indexing_status: "pending", dropbox_path: null, indexed_at: null, quote_count: 0 },
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
    // Load transcripts
    if (DEMO) { setTranscripts(MOCK_TRANSCRIPTS); return; }
    try {
      const r = await fetch(`${API_URL_RESOLVED}/api/projects/${p.id}`, { headers: hdrs() });
      const d = await r.json();
      setTranscripts(d.transcripts || []);
      // Try to load manifest filter options
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
                transcripts={transcripts} setTranscripts={setTranscripts} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
