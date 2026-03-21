import { useState, useRef, useEffect } from "react";

const DM_LOGO_SRC = "data:image/png;base64,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TBstr/1rcBzHMIxRo0ax57jqEhH/dkSeDE6aNGnYsGGQLgAKN7Tpur5x48a+ffvyaTV+H1wsw6mpqU899ZT7FOYLnYAQonfv3qtXr772jV9ehoPn4cOH77///r1793LVRtHqlnuw46BBg1577TW/lPcUheviicO4cePGjh0brpMjAEIf4qWUx44d69GjR05OTnisl7tpz+XLl7/zzjsXRmqW6n/84x8zZswIb9EKdl1paWkPPfTQyZMn+XzzotItlihd1wcNGvTee+/53b8XyhjTdX3EiBFz5sy5HnobACEI8VLKfv367d69mw93D6dwoWnayy+/zGlA99bYja1YseKll166fpI3LF3btm3r2bPnRT1o4eiWuwl35MiR7733nn9XSgsRPmZG07S+ffteUa4WAPBbE8H3339//vz54bfBn6NlTk7Of//3f7thmmsOjx071qdPH64Xv07SV+xBDcNYtmzZSy+99LubuuRVdynDMMaOHfv6669f3Q7wcG19IUR2dvbjjz/O9SloEwCu2o7s2rVrxIgRl7nm4dN7XL58+eLFi7m2kKs2nn/++f3794eZv7x81/WPf/zjiy++uPS8/4oDqyuMn332GXcpbLkt0PS6rm/btm348OEefKQsAH6ZAtq2/fzzz585c8Z1J+HKqFGj8vLyiEjX9blz586ePZuPa7g+v3QhxHPPPZeenn4J13XFusVO61//+tczzzzDRZwIzReVrkmTJn311Vf+OkYMAC8ELyKKjIz86KOPVqxYEd62g3Oh27Ztmz9/vqZpx48fHzZsmAefjR4yuNDv8OHDzz///CXmK/JK35Sfp9KzZ89z586F/TzoWsaeUmrIkCHsTdEgAFxRnMnIyHj11Ve9fGZuIcYKIcTEiROFEK+++ur+/fuDyzSuz3m/pmkLFiyYNWvWb2UL5RW1r1KKd8wdOXIkXJPOhTWNMgzj559/njJlyo033ogGAeAynRbXvo8ePTojI4M3g4b35JgrBjds2DBx4sTPPvvsepDqy9TyESNGHD9+/KLuU15R+2qaNnTo0LVr16IW43JmDUKIkSNHPvroozCmAFyOzSKi//3f/+3ateu0adPC+HTTi4aLgQMHZmVl4YG0lH+qSFpa2t///veLCrm8/GblE3wnTpyIzUmXb0+zs7M3bdqE1gDgMv1Wdnb2ggULzp49e10dVO3K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";

const DM = {
  yellow: "#FFD900", black: "#111111", nearBlack: "#1A1A1A",
  grey600: "#555555", grey400: "#999999", grey200: "#D4D4D4",
  grey100: "#EEEEEE", grey50: "#F7F7F7", white: "#FFFFFF",
  red: "#DB2B39", yellowLight: "#FFFCE8", yellowMid: "#FFF9DB",
  green: "#38A169",
};

const MODE_KEY_QUESTIONS = {
  brief: [
    "What decision does the client actually need to make?",
    "What would change if this brief were answered brilliantly?",
    "Is this a real question — or a topic dressed up as one?",
  ],
  insight: [
    "What are people trying to achieve but find difficult?",
    "Why do people buy this category that's surprising?",
    "What does your brand do better than any other?",
  ],
  positioning: [
    "Who else could credibly claim this territory?",
    "What would the brand have to give up to own this position?",
    "Where has the brand earned genuine permission?",
  ],
  newbiz: [
    "What does this prospect need to hear that they haven\'t been told?",
    "What does d+m know that others don\'t?",
    "What would they need to believe to choose d+m?",
  ],
  debrief: [
    "What genuinely surprised you — and why is that the real finding?",
    "What are you not saying because it complicates the story?",
    "What does this change about what you thought you knew going in?",
  ],
  stimulus: [
    "Whose assumptions does this stimulus reflect?",
    "Would everyone in the room agree with this? If yes — it\'s probably too safe.",
    "What version would generate responses you haven\'t heard before?",
  ],
};

const MODES = [
  {
    id: "brief",
    name: "Brief Sharpener",
    desc: "Is this the real question?",
    starters: [
      "What questions would a CSO ask before accepting this brief?",
      "What decision does the client need to make — is that in the brief?",
      "What would change if this were answered brilliantly?",
    ],
    prompt: "The user is sharing a research brief or question. Push them to find the REAL question — the one that would change something if answered. Ask what decision the client needs to make. Reject briefs that are topics disguised as questions. Be direct and challenging. Never accept the first framing.",
  },
  {
    id: "insight",
    name: "Insight Developer",
    desc: "Human truth or category observation?",
    starters: [
      "Start by telling me the brief — what are you exploring?",
      "What is the most obvious truth you need to avoid?",
      "What\'s the single most interesting thing you\'ve found?",
    ],
    prompt: `You are developing an insight. Apply this framework rigorously:

TWO-TRACK: Always distinguish category truth (how they relate to markets/brands) from human truth (deeper emotional/psychological needs). Name which track the user is on. Push from category toward human.

WHY LADDER: Run the ladder internally: observation → why → why → why → human truth. Push them deeper each exchange.

ENEMY: Help them name the enemy as a specific behaviour in the moment — not a character trait or identity condition. "Overthinking" not "lack of confidence".

BEHAVIOUR vs IDENTITY: If the user slides from what people DO to who they ARE, name it explicitly: "You\'ve moved from describing a behaviour to describing an identity — is the insight about a moment or a person?"

NOW vs FUTURE: Push toward insights about how they feel RIGHT NOW, not aspirations about who they want to become.

NEEDS vs NEEDINESS: If the insight casts the consumer as helpless or the brand as rescuer, name it: "This might be casting them as needing saving — is there a version that respects them more?"

WEIGHT: An insight can be true but too heavy for the brand context. Flag this when relevant.

MULTIPLE TERRITORIES: Resist tunnelling to one answer. Surface 2–3 competing territories and help the user choose the most fertile.

CENTRAL IDEA FORMAT: When something crystallises, push for the full statement: "[Audience] feel/know/believe [human truth]" — using the user\'s own language.

Never validate. Always ask the next harder question. Find the insight that is specific enough that only this research could have produced it.`,
  },
  {
    id: "positioning",
    name: "Positioning Developer",
    desc: "Where must the brand go?",
    starters: [
      "Who else occupies this space — and what\'s their permission vs yours?",
      "What would the brand have to give up to own this position?",
      "What\'s the version only this brand can credibly stand for?",
    ],
    prompt: "The user is exploring a brand positioning territory. Push them on who else occupies this space and what specific permission this brand has earned. What is the version only this brand can credibly stand for? What would the brand have to give up to own this position?",
  },
  {
    id: "newbiz",
    name: "New Biz Prep",
    desc: "What will make them say yes?",
    starters: [
      "What does this prospect need to hear that they haven\'t been told?",
      "What does d+m know that others don\'t?",
      "What would they need to believe to choose d+m?",
    ],
    prompt: "The user is preparing a new business pitch. Find the angle that differentiates d+m. What does d+m know that others do not? What does this prospect need to hear that they have not been told before? Push on the specific decision the prospect needs to make and what they would need to believe to make it.",
  },
  {
    id: "debrief",
    name: "Debrief Coach",
    desc: "What did we actually learn?",
    starters: [
      "What genuinely surprised you — that\'s where the real finding lives",
      "What are you not saying because it complicates the story?",
      "What would you have had to believe for this to feel like confirmation?",
    ],
    prompt: "The user is debriefing after fieldwork. Find what surprised them — that is where the real finding lives. If they only found confirmation, challenge them hard. What would they have had to believe beforehand for this to feel like a surprise? What are they not saying because it complicates the story?",
  },
  {
    id: "stimulus",
    name: "Stimulus Challenger",
    desc: "Is this doing real work?",
    starters: [
      "Whose assumptions does this stimulus reflect?",
      "Would everyone in the room agree with this? If yes — it\'s probably too safe.",
      "What version would generate responses you haven\'t heard before?",
    ],
    prompt: "The user is describing stimulus material for research. Test whether it provokes or plays safe. Whose assumptions does it reflect? What would generate more revealing, unexpected responses from participants? If everyone agrees with it in the room, it probably will not do anything useful in the field.",
  },
];

const BASE_SHARP_PROMPT = `You are Sharp — the strategic thinking partner inside d+m Explorer. Senior provocateur. Never validate. Always ask the next harder question. Push toward the organising idea.

INTERNAL FRAMEWORK — apply to every exchange:
- TWO-TRACK: Distinguish category truth from human truth. Name which track the user is on. Push from category toward human.
- WHY LADDER: Ask why this matters to them as a human being, not as a consumer.
- ENEMY: Push to name the enemy as a specific behaviour in the moment, not a character trait.
- BEHAVIOUR vs IDENTITY: If the user slides from what people DO to who they ARE, name it.
- NOW vs FUTURE: Push toward how they feel right now, not who they want to become.
- NEEDS vs NEEDINESS: If the insight casts the consumer as helpless, name it.
- WEIGHT: Flag if an insight is true but too heavy for the brand context.
- ENERGY: Score the insight 0–100 against: reveals emotional need; recognisable but unarticulated; identifies tension; doesn't cast consumer as victim; universally held; asks for brand response; helps you warm to them; feels simple.

Language rules — NEVER use: "the insight is..." / "participants feel that..." / "this shows..." / "this reveals..."
ALWAYS use: "A pattern worth interrogating:" / "It's worth asking whether..." / "What might complicate this:" / "Tension appears concentrated around..."

Format: 3–5 sentences maximum. Note what might complicate your observation. End with a question, never a conclusion. Never summarise what the user said back to them.

After each response, on a new line append this JSON exactly (fill in values when they emerge from the conversation, keep null otherwise):
{"humanTruth":null,"categoryTruth":null,"brandTruth":null,"centralIdea":null,"energyScore":0,"established":[],"questions":[],"suggestions":["suggestion 1","suggestion 2"]}`;

const CHAT_SYSTEM = `You are a d+m-aware assistant inside d+m Explorer. d+m is a qualitative insights and strategy agency. This platform is designed to help develop your thinking — not give you the answer. You understand their planning mindset: insight drives strategy, not data volume. You know their 4-stage workflow (Design, Experience, Analysis, Deliver). Be direct, sharp, and useful. Avoid hedging. When asked about d+m tools, explain them clearly. If someone uploads an image or document, read it carefully and respond thoughtfully.`;

const EXPLORERS_FAQ_SYSTEM = `You are the d+m Explorer assistant. You know the full suite of d+m Explorer tools:
- Discourse Explorer (LIVE): analyses research transcripts for discourse patterns, semantic clusters, and rhetorical structures
- Truth Explorer (IN DEVELOPMENT): processes verbatim interview data, identifies signal moments, tracks participant language patterns
- Semiotics Explorer (LIVE): cultural and semiotic analysis of visual and textual stimulus material
- Clip Explorer (LIVE): identifies and clips key moments from research video recordings

Answer team questions about which tool to use, what data is needed, and how to get the most from each Explorer. Be concise and practical.`;

// ── Components ────────────────────────────────────────────────────────────────

const DmLogo = ({ height = 22 }) => (
  <img src={DM_LOGO_SRC} alt="d+m" style={{ height: `${height}px`, display: "block" }} />
);

const Label = ({ children, style }) => (
  <span style={{
    fontFamily: "\'Space Mono\', monospace", fontSize: "9px",
    color: DM.grey400, letterSpacing: "0.06em", textTransform: "uppercase",
    ...style
  }}>{children}</span>
);

const Tag = ({ children, style }) => (
  <span style={{
    background: DM.yellowMid, color: DM.black,
    fontFamily: "\'Space Mono\', monospace", fontSize: "9px",
    letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "3px 8px", borderRadius: "3px",
    ...style
  }}>{children}</span>
);

const Btn = ({ children, active, onClick, style }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: "4px",
    fontFamily: "\'Poppins\', sans-serif", fontSize: "11px", fontWeight: 500,
    border: active ? `1.5px solid ${DM.yellow}` : "1.5px solid transparent",
    background: active ? DM.yellowMid : "transparent",
    color: active ? DM.black : "#666",
    cursor: "pointer", transition: "all 0.15s",
    ...style
  }}>{children}</button>
);

const PrimaryBtn = ({ children, disabled, onClick, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "12px 22px", borderRadius: "4px",
    fontFamily: "\'Anton\', sans-serif", fontSize: "13px", letterSpacing: "0.04em",
    border: "none",
    background: disabled ? DM.grey100 : DM.yellow,
    color: disabled ? DM.grey400 : DM.black,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    ...style
  }}>{children}</button>
);

const Spinner = ({ size = 14, color = DM.yellow }) => (
  <div style={{
    width: `${size}px`, height: `${size}px`,
    border: `2px solid ${DM.grey100}`,
    borderTopColor: color, borderRadius: "50%",
    animation: "spin 0.6s linear infinite", display: "inline-block",
  }} />
);

// ── API ───────────────────────────────────────────────────────────────────────

async function callClaude(messages, system, context = {}) {
  const resp = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system,
      messages,
      _context: context,
    }),
  });
  const data = await resp.json();
  return data.content?.[0]?.text || "";
}

function parseSharpJson(text) {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.startsWith("{") && line.includes("energyScore")) {
      try { return JSON.parse(line); } catch {}
    }
  }
  const match = text.match(/\{[^{}]*"energyScore"[^{}]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return null;
}

function stripSharpJson(text) {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().includes("energyScore")) {
      return lines.slice(0, i).join("\n").trim();
    }
  }
  return text.trim();
}

// ── Chat Tab ──────────────────────────────────────────────────────────────────

function ChatTab() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attached, setAttached] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const resumeRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const handleAttach = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isText = file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttached({ type: "image", data: ev.target.result.split(",")[1], name: file.name, mediaType: file.type });
      };
      reader.readAsDataURL(file);
    } else if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => { setAttached({ type: "text", data: ev.target.result, name: file.name }); };
      reader.readAsText(file);
    } else {
      alert("Supported: images (jpg, png, gif, webp) and text files (.txt, .md)\n\nFor PDFs and DOCX, use the knowledge upload in Settings.");
    }
    e.target.value = "";
  };

  const exportChat = () => {
    const data = { version: 1, type: "chat", exportedAt: new Date().toISOString(), messages: msgs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `dm-chat-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const resumeChat = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.type === "chat" && Array.isArray(data.messages)) setMsgs(data.messages);
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const send = async () => {
    if ((!input.trim() && !attached) || loading) return;
    const userText = input.trim() || (attached ? "What do you think of this?" : "");
    setInput("");
    const userMsg = { role: "user", text: userText, attached };
    setAttached(null);
    setMsgs(m => [...m, userMsg]);
    setLoading(true);
    try {
      const history = [...msgs, userMsg].map(m => {
        if (m.attached?.type === "image") {
          return { role: "user", content: [
            { type: "image", source: { type: "base64", media_type: m.attached.mediaType, data: m.attached.data } },
            { type: "text", text: m.text || "What do you see here?" }
          ]};
        }
        const text = m.attached?.type === "text" ? `[File: ${m.attached.name}]\n\n${m.attached.data}\n\n${m.text}` : m.text;
        return { role: m.role === "user" ? "user" : "assistant", content: text };
      });
      const reply = await callClaude(history, CHAT_SYSTEM, { tab: "chat" });
      setMsgs(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { setAttached({ type: "image", data: ev.target.result.split(",")[1], name: "pasted-image.png", mediaType: item.type }); };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "8px 20px", borderBottom: `1px solid ${DM.grey100}`, display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0, minHeight: 40 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {msgs.length > 0 && (
              <button onClick={exportChat} style={{ background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 3, padding: "3px 10px", fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.grey400, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>Export</button>
            )}
            <label style={{ background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 3, padding: "3px 10px", fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.grey400, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Resume<input ref={resumeRef} type="file" accept=".json" onChange={resumeChat} style={{ display: "none" }} />
            </label>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {msgs.length === 0 && (
            <div style={{ margin: "auto", textAlign: "center", padding: "40px 20px", maxWidth: 420 }}>
              <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 24, color: DM.grey200, letterSpacing: "0.04em", marginBottom: 8 }}>D+M EXPLORER</div>
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400, lineHeight: 1.7 }}>I'm your strategic sparring partner, here to help develop your thinking not give you the answers. Trained in the d+m ethos, powered by Claude. So, what are you wrestling with?</div>
            </div>
          )}
          {msgs.map((m, i) => m.role === "user" ? (
            <div key={i} style={{ background: DM.white, border: `1px solid ${DM.grey100}`, borderRadius: 6, padding: "12px 15px", animation: "fadeUp 0.2s ease" }}>
              <Label>You</Label>
              {m.attached?.type === "image" && (
                <div style={{ marginTop: 8, marginBottom: 6 }}>
                  <img src={`data:${m.attached.mediaType};base64,${m.attached.data}`} alt={m.attached.name} style={{ maxWidth: 200, maxHeight: 140, borderRadius: 4, border: `1px solid ${DM.grey100}` }} />
                </div>
              )}
              {m.attached?.type === "text" && (
                <div style={{ marginTop: 6, marginBottom: 4, background: DM.grey50, border: `1px solid ${DM.grey100}`, borderRadius: 3, padding: "4px 8px", fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400 }}>📄 {m.attached.name}</div>
              )}
              <div style={{ marginTop: 6, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey600, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ) : (
            <div key={i} style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 15px", animation: "fadeUp 0.2s ease" }}>
              <Label style={{ color: "#aaa" }}>D+M Explorer · Chat</Label>
              <div style={{ marginTop: 6, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.black, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 15px", display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={12} /><span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: "#bbb" }}>Thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {attached && (
          <div style={{ padding: "6px 20px", borderTop: `1px solid ${DM.grey100}`, background: DM.grey50, display: "flex", alignItems: "center", gap: 8 }}>
            {attached.type === "image" ? (
              <img src={`data:${attached.mediaType};base64,${attached.data}`} alt={attached.name} style={{ height: 36, borderRadius: 3 }} />
            ) : (
              <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400 }}>📄 {attached.name}</span>
            )}
            <button onClick={() => setAttached(null)} style={{ background: "none", border: "none", cursor: "pointer", color: DM.grey400, fontSize: 14, marginLeft: "auto" }}>×</button>
          </div>
        )}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${DM.grey100}`, background: DM.white, flexShrink: 0, display: "flex", gap: 8, alignItems: "flex-end" }}>
          <label title="Attach image or text file" style={{ cursor: "pointer", color: DM.grey400, display: "flex", alignItems: "center", padding: "9px 6px", fontSize: 16, flexShrink: 0 }}>
            📎<input ref={fileRef} type="file" accept="image/*,.txt,.md" onChange={handleAttach} style={{ display: "none" }} />
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            onPaste={handlePaste}
            placeholder="Ask anything..."
            rows={2}
            style={{ flex: 1, border: `1.5px solid ${DM.grey200}`, borderRadius: 4, padding: "9px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, lineHeight: 1.5, resize: "none", outline: "none" }}
          />
          <PrimaryBtn onClick={send} disabled={(!input.trim() && !attached) || loading} style={{ padding: "10px 18px", fontSize: 12 }}>SEND</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ── Sharp Tab ─────────────────────────────────────────────────────────────────

const NOTES_KEY = "dm_sharp_notes";

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]"); } catch { return []; }
}

function saveNotes(notes) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch {}
}

function EnergyIndicator({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const trackColor = score < 20 ? DM.grey200 : score < 45 ? "#FDE68A" : DM.yellow;
  return (
    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${DM.grey100}` }}>
      <Label style={{ display: "block", marginBottom: 10 }}>Insight Energy</Label>
      <div style={{ position: "relative", height: 16, marginBottom: 4 }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, background: DM.grey100, borderRadius: 2, transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, height: 4, width: `${pct}%`, background: trackColor, borderRadius: 2, transform: "translateY(-50%)", transition: "width 0.4s ease" }} />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 18, height: 18, borderRadius: "50%",
          background: pct === 0 ? DM.grey200 : DM.yellow,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "\'Poppins\', sans-serif", fontWeight: 700, fontSize: 12, color: DM.black,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          transition: "left 0.4s ease, background 0.4s ease",
          zIndex: 1,
        }}>+</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 7, color: DM.grey400, letterSpacing: "0.06em" }}>FLAT</span>
        <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 7, color: DM.grey400, letterSpacing: "0.06em" }}>SHARP</span>
      </div>
    </div>
  );
}

function TruthSlot({ label, value, placeholder }) {
  return (
    <div style={{ padding: "10px 16px", borderBottom: `1px solid ${DM.grey100}` }}>
      <Label style={{ marginBottom: 5, display: "block" }}>{label}</Label>
      {value ? (
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.black, lineHeight: 1.5, background: DM.yellowLight, borderLeft: `2px solid ${DM.yellow}`, padding: "6px 8px", borderRadius: "0 3px 3px 0", animation: "fadeUp 0.2s ease" }}>{value}</div>
      ) : (
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 10, color: "#ccc", fontStyle: "italic" }}>{placeholder}</div>
      )}
    </div>
  );
}

function SharpenTab() {
  const [activeMode, setActiveMode] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [humanTruth, setHumanTruth] = useState(null);
  const [categoryTruth, setCategoryTruth] = useState(null);
  const [brandTruth, setBrandTruth] = useState(null);
  const [centralIdea, setCentralIdea] = useState(null);
  const [energyScore, setEnergyScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [savedNotes, setSavedNotes] = useState(loadNotes);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const sharpResumeRef = useRef(null);
  const sharpFileRef = useRef(null);
  const [sharpAttached, setSharpAttached] = useState(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  useEffect(() => { saveNotes(savedNotes); }, [savedNotes]);

  const clipSelection = () => {
    const sel = window.getSelection().toString().trim();
    if (sel) {
      const note = { id: Date.now(), text: sel, modeId: activeMode?.id, ts: new Date().toISOString() };
      setSavedNotes(prev => [...prev, note]);
    }
  };

  const deleteNote = (id) => setSavedNotes(prev => prev.filter(n => n.id !== id));

  const exportNotes = () => {
    const text = savedNotes.map(n => `• ${n.text}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `sharp-notes-${new Date().toISOString().slice(0,10)}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportSharp = () => {
    if (!activeMode) return;
    const data = { version: 1, type: "sharp", modeId: activeMode.id, modeName: activeMode.name, exportedAt: new Date().toISOString(), messages: msgs, humanTruth, categoryTruth, brandTruth, centralIdea, energyScore, savedNotes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `sharp-${activeMode.id}-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const resumeSharp = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.type === "sharp") {
          const mode = MODES.find(m => m.id === data.modeId);
          if (mode) setActiveMode(mode);
          setMsgs(data.messages || []);
          setHumanTruth(data.humanTruth || null);
          setCategoryTruth(data.categoryTruth || null);
          setBrandTruth(data.brandTruth || null);
          setCentralIdea(data.centralIdea || null);
          setEnergyScore(data.energyScore || 0);
        }
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const selectMode = (mode) => {
    setActiveMode(mode);
    setMsgs([]);
    setHumanTruth(null);
    setCategoryTruth(null);
    setBrandTruth(null);
    setCentralIdea(null);
    setEnergyScore(0);
    setSuggestions([]);
    setInput("");
  };

  const back = () => {
    setActiveMode(null);
    setMsgs([]);
    setHumanTruth(null);
    setCategoryTruth(null);
    setBrandTruth(null);
    setCentralIdea(null);
    setEnergyScore(0);
    setSuggestions([]);
    setInput("");
  };

  const handleSharpAttach = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => { setSharpAttached({ type: "image", data: ev.target.result.split(",")[1], name: file.name, mediaType: file.type }); };
      reader.readAsDataURL(file);
    } else if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => { setSharpAttached({ type: "text", data: ev.target.result, name: file.name }); };
      reader.readAsText(file);
    } else { alert("Supported: images and text files (.txt, .md)"); }
    e.target.value = "";
  };

  const handleSharpPaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { setSharpAttached({ type: "image", data: ev.target.result.split(",")[1], name: "pasted-image.png", mediaType: item.type }); };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const send = async (text) => {
    const userText = (text || input).trim();
    const attachment = sharpAttached;
    if ((!userText && !attachment) || loading) return;
    setInput("");
    setSuggestions([]);
    setSharpAttached(null);
    const newMsgs = [...msgs, { role: "user", text: userText || "What do you think of this?", attached: attachment }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const system = BASE_SHARP_PROMPT + "\n\nMode: " + activeMode.name + " — " + activeMode.desc + "\n" + activeMode.prompt;
      const history = newMsgs.map(m => {
        if (m.attached?.type === "image") return { role: "user", content: [{ type: "image", source: { type: "base64", media_type: m.attached.mediaType, data: m.attached.data } }, { type: "text", text: m.text }] };
        const txt = m.attached?.type === "text" ? `[File: ${m.attached.name}]\n\n${m.attached.data}\n\n${m.text}` : m.text;
        return { role: m.role === "user" ? "user" : "assistant", content: txt };
      });
      const raw = await callClaude(history, system, { tab: "sharp", modeId: activeMode.id });
      const parsed = parseSharpJson(raw);
      const clean = stripSharpJson(raw);
      setMsgs(m => [...m, { role: "sharp", text: clean }]);
      if (parsed) {
        if (parsed.humanTruth) setHumanTruth(parsed.humanTruth);
        if (parsed.categoryTruth) setCategoryTruth(parsed.categoryTruth);
        if (parsed.brandTruth) setBrandTruth(parsed.brandTruth);
        if (parsed.centralIdea) setCentralIdea(parsed.centralIdea);
        if (typeof parsed.energyScore === "number") setEnergyScore(parsed.energyScore);
        if (parsed.suggestions?.length) setSuggestions(parsed.suggestions.slice(0, 3));
      }
    } catch {
      setMsgs(m => [...m, { role: "sharp", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  // ── Card grid (landing) ──
  if (!activeMode) {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 20, color: DM.black, letterSpacing: "0.04em", marginBottom: 6 }}>SHARPEN</div>
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400, maxWidth: 480 }}>Structured thinking modes. Sharp never validates — it always asks the next harder question. Choose a mode to begin.</div>
            </div>
            <label style={{ border: `1px solid ${DM.grey200}`, borderRadius: 3, padding: "5px 12px", fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.grey400, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0, marginTop: 4 }}>
              Resume session<input ref={sharpResumeRef} type="file" accept=".json" onChange={resumeSharp} style={{ display: "none" }} />
            </label>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {MODES.map(mode => <ModeCard key={mode.id} mode={mode} onSelect={() => selectMode(mode)} />)}
        </div>
      </div>
    );
  }

  // ── Conversation view ──
  const keyQs = MODE_KEY_QUESTIONS[activeMode.id] || [];

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left panel: active mode expanded */}
      <div style={{ width: 228, borderRight: `1px solid ${DM.grey100}`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", background: DM.white }}>
        <div style={{ padding: "12px 16px 10px", borderBottom: `1px solid ${DM.grey100}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={back} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: DM.grey400, fontFamily: "\'Poppins\', sans-serif", fontSize: 11, padding: 0 }}>
            <span style={{ fontSize: 14 }}>←</span> All modes
          </button>
          {msgs.length > 0 && (
            <button onClick={exportSharp} style={{ background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 3, padding: "3px 8px", fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.grey400, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>Export</button>
          )}
        </div>
        {/* Active card */}
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${DM.grey100}`, background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}` }}>
          <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 15, color: DM.black, letterSpacing: "0.04em", marginBottom: 4 }}>{activeMode.name.toUpperCase()}</div>
          <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, fontWeight: 300, color: DM.grey600, lineHeight: 1.5 }}>{activeMode.desc}</div>
        </div>
        {/* Key questions */}
        {keyQs.length > 0 && (
          <div style={{ padding: "12px 16px" }}>
            <Label style={{ marginBottom: 10, display: "block" }}>Key questions</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {keyQs.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: DM.yellow, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 10, color: DM.grey600, lineHeight: 1.5 }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeMode.id === "insight" && <HowItWorksPanel />}
      </div>

      {/* Conversation column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }} onMouseUp={clipSelection}>
          {msgs.length === 0 && (
            <div style={{ margin: "auto", textAlign: "center", padding: "30px 20px", maxWidth: 460 }}>
              <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 20, color: DM.grey200, letterSpacing: "0.04em", marginBottom: 8 }}>{activeMode.name.toUpperCase()}</div>
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: "#ccc", marginBottom: 20 }}>Start by sharing your brief, insight or challenge.</div>
              {activeMode.starters?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                  <Label style={{ marginBottom: 4 }}>Or try a starter</Label>
                  {activeMode.starters.map((s, i) => (
                    <button key={i} onClick={() => send(s)} style={{
                      background: DM.white, border: `1px solid ${DM.grey200}`, borderRadius: 20,
                      padding: "7px 16px", fontFamily: "\'Poppins\', sans-serif", fontSize: 11,
                      color: DM.grey600, cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = DM.yellow; e.currentTarget.style.background = DM.yellowLight; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = DM.grey200; e.currentTarget.style.background = DM.white; }}
                    >{s}</button>
                  ))}
                </div>
              )}
            </div>
          )}
          {msgs.map((m, i) => m.role === "user" ? (
            <div key={i} style={{ background: DM.white, border: `1px solid ${DM.grey100}`, borderRadius: 6, padding: "12px 15px", animation: "fadeUp 0.2s ease" }}>
              <Label>You</Label>
              <div style={{ marginTop: 6, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey600, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ) : (
            <div key={i} style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 15px", animation: "fadeUp 0.2s ease", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <Label style={{ color: "#aaa" }}>Sharp · {activeMode.name}</Label>
                <button
                  title="Clip selected text to notes"
                  onClick={clipSelection}
                  style={{ background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 3, padding: "2px 7px", fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.grey400, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}
                >✂ clip</button>
              </div>
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.black, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 15px", display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={12} /><span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: "#bbb" }}>Sharp is thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {suggestions.length > 0 && (
          <div style={{ padding: "8px 20px 4px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{
                background: DM.white, border: `1px solid ${DM.grey200}`, borderRadius: 20,
                padding: "5px 13px", fontFamily: "\'Poppins\', sans-serif", fontSize: 10,
                color: DM.grey600, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = DM.yellow; e.currentTarget.style.background = DM.yellowLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DM.grey200; e.currentTarget.style.background = DM.white; }}
              >{s}</button>
            ))}
          </div>
        )}
        {sharpAttached && (
          <div style={{ padding: "6px 20px", borderTop: `1px solid ${DM.grey100}`, background: DM.grey50, display: "flex", alignItems: "center", gap: 8 }}>
            {sharpAttached.type === "image" ? <img src={`data:${sharpAttached.mediaType};base64,${sharpAttached.data}`} alt="" style={{ height: 36, borderRadius: 3 }} /> : <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400 }}>📄 {sharpAttached.name}</span>}
            <button onClick={() => setSharpAttached(null)} style={{ background: "none", border: "none", cursor: "pointer", color: DM.grey400, fontSize: 14, marginLeft: "auto" }}>×</button>
          </div>
        )}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${DM.grey100}`, background: DM.white, flexShrink: 0, display: "flex", gap: 8, alignItems: "flex-end" }}>
          <label title="Attach image or text file" style={{ cursor: "pointer", color: DM.grey400, display: "flex", alignItems: "center", padding: "9px 6px", fontSize: 16, flexShrink: 0 }}>
            📎<input ref={sharpFileRef} type="file" accept="image/*,.txt,.md" onChange={handleSharpAttach} style={{ display: "none" }} />
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            onPaste={handleSharpPaste}
            placeholder="Your brief, your challenge, your thinking..."
            rows={2}
            style={{ flex: 1, border: `1.5px solid ${DM.grey200}`, borderRadius: 4, padding: "9px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, lineHeight: 1.5, resize: "none", outline: "none" }}
          />
          <PrimaryBtn onClick={() => send()} disabled={(!input.trim() && !sharpAttached) || loading} style={{ padding: "10px 18px", fontSize: 12 }}>SEND</PrimaryBtn>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 260, borderLeft: `1px solid ${DM.grey100}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#FAFAFA" }}>
        <EnergyIndicator score={energyScore} />

        {/* Truth slots — Insight Developer only */}
        {activeMode.id === "insight" && (
          <>
            <TruthSlot label="Human Truth" value={humanTruth} placeholder="Emerging as you develop the insight..." />
            <TruthSlot label="Category Truth" value={categoryTruth} placeholder="How they relate to the market..." />
            <TruthSlot label="Brand Truth" value={brandTruth} placeholder="What only this brand can own..." />
            <TruthSlot label="Central Idea" value={centralIdea} placeholder="The organising idea in your language..." />
          </>
        )}

        {/* Saved thoughts */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${DM.grey100}` }}>
            <Label>Saved Thoughts</Label>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.grey400 }}>Highlight + ✂ to clip</span>
              {savedNotes.length > 0 && (
                <button onClick={exportNotes} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: DM.yellow, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>Export all</button>
              )}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {savedNotes.length === 0 && (
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 10, color: "#ccc", fontStyle: "italic", padding: "6px 4px" }}>No notes yet — highlight text and click ✂ clip to save a thought.</div>
            )}
            {savedNotes.map(note => (
              <div key={note.id} style={{ background: DM.yellowMid, borderRadius: 4, padding: "8px 10px", position: "relative", animation: "fadeUp 0.15s ease" }}>
                <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 10, color: DM.black, lineHeight: 1.5, paddingRight: 16 }}>{note.text}</div>
                <button onClick={() => deleteNote(note.id)} style={{ position: "absolute", top: 5, right: 6, background: "none", border: "none", cursor: "pointer", color: DM.grey400, fontSize: 11, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorksPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: "10px 16px", borderTop: `1px solid ${DM.grey100}` }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 3, padding: "5px 10px", fontFamily: "'Space Mono', monospace", fontSize: 8, color: DM.grey400, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", width: "100%" }}>
        {open ? "✕ Close" : "? How does this work"}
      </button>
      {open && (
        <div style={{ marginTop: 10, fontFamily: "'Poppins', sans-serif", fontSize: 10, color: DM.grey600, lineHeight: 1.6, animation: "fadeUp 0.15s ease" }}>
          <div style={{ marginBottom: 8 }}><strong style={{ color: DM.black }}>Two-track thinking.</strong> Insight Developer distinguishes category truth (how people relate to a market) from human truth (deeper emotional needs). It will name which track you're on and push you deeper.</div>
          <div style={{ marginBottom: 8 }}><strong style={{ color: DM.black }}>The why ladder.</strong> Every observation gets interrogated — why does this matter to them as a human, not just as a consumer?</div>
          <div style={{ marginBottom: 8 }}><strong style={{ color: DM.black }}>Right panel.</strong> As the conversation develops, Human Truth, Category Truth, Brand Truth and Central Idea slots populate automatically in your language.</div>
          <div style={{ marginBottom: 8 }}><strong style={{ color: DM.black }}>Energy indicator.</strong> The yellow + scale scores insight sharpness against 8 criteria — from generic (flat) to specific and fertile (sharp).</div>
          <div><strong style={{ color: DM.black }}>Clip thoughts.</strong> Highlight any text in the conversation and click ✂ clip to save it as a sticky note. Export all notes before your session ends.</div>
        </div>
      )}
    </div>
  );
}

function ModeCard({ mode, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onSelect} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      border: `1.5px solid ${hover ? DM.yellow : DM.grey100}`,
      borderRadius: 6, padding: "20px 18px", cursor: "pointer",
      background: hover ? DM.yellowLight : DM.white,
      transition: "all 0.15s", animation: "fadeUp 0.2s ease",
    }}>
      <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 14, color: DM.black, letterSpacing: "0.04em", marginBottom: 6 }}>{mode.name.toUpperCase()}</div>
      <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.grey600, lineHeight: 1.6 }}>{mode.desc}</div>
    </div>
  );
}

// ── Explorers Tab ─────────────────────────────────────────────────────────────

const EXPLORER_CARDS = [
  { name: "Discourse Explorer", status: "LIVE", url: "https://discourse-explorer.netlify.app/", desc: "Analyses research transcripts for discourse patterns, semantic clusters, and rhetorical structures." },
  { name: "Truth Explorer", status: "IN DEVELOPMENT", desc: "Processes verbatim interview data, identifies signal moments, tracks participant language patterns." },
  { name: "Semiotics Explorer", status: "LIVE", url: "https://dm-semiotics-explorer.netlify.app/", desc: "Cultural and semiotic analysis of visual and textual stimulus material." },
  { name: "Clip Explorer", status: "LIVE", url: "https://dm-clip-explorer.netlify.app/", desc: "Identifies and clips key moments from research video recordings." },
];

function ExplorersTab() {
  const [faqInput, setFaqInput] = useState("");
  const [faqMsgs, setFaqMsgs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [faqMsgs]);

  const sendFaq = async () => {
    if (!faqInput.trim() || faqLoading) return;
    const text = faqInput.trim();
    setFaqInput("");
    setFaqMsgs(m => [...m, { role: "user", text }]);
    setFaqLoading(true);
    try {
      const history = [...faqMsgs, { role: "user", text }].map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const reply = await callClaude(history, EXPLORERS_FAQ_SYSTEM, { tab: "explorers" });
      setFaqMsgs(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setFaqMsgs(m => [...m, { role: "assistant", text: "Something went wrong." }]);
    }
    setFaqLoading(false);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 20, color: DM.black, letterSpacing: "0.04em", marginBottom: 6 }}>EXPLORERS</div>
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400 }}>Live research platforms. Built for the d+m workflow.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 32 }}>
        {EXPLORER_CARDS.map(card => <ExplorerCard key={card.name} card={card} />)}
      </div>
      <div style={{ borderTop: `1px solid ${DM.grey100}`, paddingTop: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <Label>Ask about the Explorers</Label>
          <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey400, marginTop: 4 }}>Questions, how-to, or feature suggestions.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
          {faqMsgs.map((m, i) => m.role === "user" ? (
            <div key={i} style={{ background: DM.white, border: `1px solid ${DM.grey100}`, borderRadius: 6, padding: "10px 14px" }}>
              <Label>You</Label>
              <div style={{ marginTop: 5, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey600 }}>{m.text}</div>
            </div>
          ) : (
            <div key={i} style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "10px 14px" }}>
              <Label style={{ color: "#aaa" }}>Explorer Guide</Label>
              <div style={{ marginTop: 5, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.black, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ))}
          {faqLoading && (
            <div style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={11} /><span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: "#bbb" }}>Thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              value={faqInput}
              onChange={e => setFaqInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFaq(); } }}
              placeholder="What data do I need for the Discourse Explorer?"
              rows={2}
              style={{ flex: 1, border: `1.5px solid ${DM.grey200}`, borderRadius: 4, padding: "9px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, lineHeight: 1.5, resize: "none", outline: "none" }}
            />
            <PrimaryBtn onClick={sendFaq} disabled={!faqInput.trim() || faqLoading} style={{ padding: "10px 16px", fontSize: 11 }}>ASK</PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplorerCard({ card }) {
  const [hover, setHover] = useState(false);
  const isLive = card.status === "LIVE";
  const statusColor = isLive ? DM.green : card.status === "IN DEVELOPMENT" ? "#F59E0B" : DM.grey400;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      border: `1.5px solid ${hover && isLive ? DM.yellow : DM.grey100}`,
      borderRadius: 6, padding: "18px 16px", background: DM.white, transition: "all 0.15s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 13, fontWeight: 600, color: DM.black }}>{card.name}</div>
        <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 8, letterSpacing: "0.06em", textTransform: "uppercase", color: statusColor, background: statusColor + "18", padding: "3px 7px", borderRadius: 3, flexShrink: 0, marginLeft: 8 }}>{card.status}</span>
      </div>
      <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, fontWeight: 300, color: DM.grey600, lineHeight: 1.6, marginBottom: 14 }}>{card.desc}</div>
      {isLive ? (
        <a href={card.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 16px", background: DM.yellow, borderRadius: 4, fontFamily: "\'Anton\', sans-serif", fontSize: 11, color: DM.black, textDecoration: "none", letterSpacing: "0.04em" }}>LAUNCH →</a>
      ) : (
        <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey400 }}>Coming soon</span>
      )}
    </div>
  );
}

// ── Collaborate Tab ───────────────────────────────────────────────────────────

const DEMO_FOLDERS = [
  {
    id: "hsbc", name: "HSBC — Trust Study", members: ["S", "JK"], date: "18 Mar",
    activity: [
      { type: "sharp", text: "Brief Sharpener session: real question identified as \'role of physical presence\'", time: "2h ago", author: "S" },
      { type: "explorer", text: "Discourse Explorer run on 14 transcripts — 3 dominant themes extracted", time: "Yesterday", author: "JK" },
      { type: "note", text: "Client meeting confirmed for 28 March. Toplines needed by 26th.", time: "2 days ago", author: "S" },
    ],
    sharpOutputs: ["Brief sharpened: \'Does physical presence create trust, or just signal it?\'", "Open question: What do customers use branches for that they won\'t articulate as trust-building?"],
    explorerOutputs: ["3 key discourse clusters identified", "Hesitation language prevalent in HNWI segment"],
  },
  {
    id: "barclays", name: "Barclays — New Biz Pitch", members: ["S", "RM"], date: "15 Mar",
    activity: [
      { type: "sharp", text: "New Biz Prep: core differentiation angle identified", time: "3 days ago", author: "S" },
      { type: "note", text: "Pitch deck v1 reviewed. Strong on insight angle, needs sharper opening.", time: "4 days ago", author: "RM" },
    ],
    sharpOutputs: ["Pitch angle: \'insight with a planning mindset vs measurement alone\'"],
    explorerOutputs: [],
  },
];

function CollaborateTab() {
  const [activeFolder, setActiveFolder] = useState(null);
  if (activeFolder) return <FolderView folder={activeFolder} onBack={() => setActiveFolder(null)} />;
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 20, color: DM.black, letterSpacing: "0.04em", marginBottom: 6 }}>COLLABORATE</div>
          <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400 }}>Project folders. Shared outputs. Handoff builder.</div>
        </div>
        <PrimaryBtn style={{ fontSize: 11, padding: "9px 16px" }}>+ NEW FOLDER</PrimaryBtn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 700 }}>
        {DEMO_FOLDERS.map(f => <FolderRow key={f.id} folder={f} onClick={() => setActiveFolder(f)} />)}
      </div>
      <div style={{ marginTop: 16, fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey400, fontStyle: "italic" }}>Demo content — showing what a live workspace feels like.</div>
    </div>
  );
}

function FolderRow({ folder, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick} style={{
      border: `1.5px solid ${hover ? DM.yellow : DM.grey100}`, borderRadius: 6,
      padding: "16px 18px", cursor: "pointer", background: hover ? DM.yellowLight : DM.white,
      transition: "all 0.15s", display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 13, fontWeight: 600, color: DM.black, marginBottom: 3 }}>{folder.name}</div>
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey400 }}>{folder.activity[0]?.text?.slice(0, 60)}...</div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {folder.members.map((m, i) => (
          <div key={m} style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? DM.yellow : DM.grey100, border: `2px solid ${DM.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "\'Poppins\', sans-serif", fontSize: 9, fontWeight: 700, color: i === 0 ? DM.black : DM.grey600, marginLeft: i > 0 ? -6 : 0, zIndex: folder.members.length - i, position: "relative" }}>{m}</div>
        ))}
      </div>
      <div style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400, letterSpacing: "0.04em" }}>{folder.date}</div>
    </div>
  );
}

function FolderView({ folder, onBack }) {
  const [activeSection, setActiveSection] = useState("activity");
  const activityIcons = { sharp: "◆", explorer: "◎", note: "·" };
  const activityColors = { sharp: DM.yellow, explorer: "#3B82F6", note: DM.grey400 };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${DM.grey100}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: DM.grey400, fontFamily: "\'Poppins\', sans-serif", fontSize: 11, padding: 0 }}>← Projects</button>
        <div style={{ width: 1, height: 16, background: DM.grey200 }} />
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 13, fontWeight: 600, color: DM.black }}>{folder.name}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {["activity", "sharp", "explorers", "handoff"].map(s => (
            <Btn key={s} active={activeSection === s} onClick={() => setActiveSection(s)} style={{ fontSize: 10, padding: "5px 12px" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Btn>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {activeSection === "activity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 600 }}>
            <Label style={{ marginBottom: 8 }}>Activity Feed</Label>
            {folder.activity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", border: `1px solid ${DM.grey100}`, borderLeft: `3px solid ${activityColors[a.type]}`, borderRadius: "0 6px 6px 0", background: DM.white }}>
                <span style={{ color: activityColors[a.type], fontSize: 14, marginTop: 1 }}>{activityIcons[a.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, lineHeight: 1.6 }}>{a.text}</div>
                  <div style={{ marginTop: 4, fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400 }}>{a.time} · {a.author}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeSection === "sharp" && (
          <div style={{ maxWidth: 600 }}>
            <Label style={{ marginBottom: 12, display: "block" }}>Saved Sharp Outputs</Label>
            {folder.sharpOutputs.map((o, i) => (
              <div key={i} style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.black, lineHeight: 1.7 }}>{o}</div>
              </div>
            ))}
            {!folder.sharpOutputs.length && <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400, fontStyle: "italic" }}>No Sharp outputs saved yet.</div>}
          </div>
        )}
        {activeSection === "explorers" && (
          <div style={{ maxWidth: 600 }}>
            <Label style={{ marginBottom: 12, display: "block" }}>Explorer Outputs</Label>
            {folder.explorerOutputs.map((o, i) => (
              <div key={i} style={{ background: "#EFF6FF", borderLeft: "3px solid #3B82F6", borderRadius: "0 6px 6px 0", padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.black, lineHeight: 1.7 }}>{o}</div>
              </div>
            ))}
            {!folder.explorerOutputs.length && <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400, fontStyle: "italic" }}>No Explorer outputs yet.</div>}
          </div>
        )}
        {activeSection === "handoff" && (
          <div style={{ maxWidth: 600 }}>
            <Label style={{ marginBottom: 12, display: "block" }}>Handoff Builder</Label>
            <div style={{ background: DM.grey50, border: `1px solid ${DM.grey100}`, borderRadius: 6, padding: "20px 18px", marginBottom: 14 }}>
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey600, lineHeight: 1.7, marginBottom: 12 }}>Build a handoff document from this project\'s outputs. Select what to include, then export.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {["Sharp outputs", "Explorer outputs", "Activity summary", "Open questions"].map(item => (
                  <label key={item} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: DM.yellow }} />
                    <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black }}>{item}</span>
                  </label>
                ))}
              </div>
              <PrimaryBtn style={{ fontSize: 11, padding: "9px 18px" }}>EXPORT HANDOFF</PrimaryBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Build Tab ─────────────────────────────────────────────────────────────────

const BUILD_SYSTEM = `You are the d+m Build partner — a warm, curious thinking collaborator helping the d+m team develop new tool or product ideas. This platform is designed to help develop your thinking — not give you the answer.

EXPLORE mode (default): Help the user develop their idea through questions and provocation. Ask one question at a time. Find what\'s genuinely interesting about the idea. Push past the obvious use case. Don\'t give them a spec — give them better questions.

DEFINE mode (when the idea is ready): Help crystallise the concept into a clear one-paragraph definition: what it does, who it\'s for, what problem it solves, why d+m is the right team to build it. Then output a structured spec.

Guide them toward the organising idea. Never produce output the user hasn\'t earned through thinking.`;

function BuildTab() {
  const [phase, setPhase] = useState("entry");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([
    { id: 1, title: "Brief Validator", problem: "Score a research brief against d+m planning principles before it goes to field", status: "Being Built", author: "JK", date: "10 Mar" },
    { id: 2, title: "Prop Inspo", problem: "Take inspiration from the best proposals to help you win this next one", status: "Idea", author: "You", date: "Today" },
  ]);
  const [entryText, setEntryText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const startExplore = async () => {
    if (!entryText.trim()) return;
    setPhase("explore");
    const userText = entryText.trim();
    setEntryText("");
    const userMsg = { role: "user", text: userText };
    setMsgs([userMsg]);
    setLoading(true);
    try {
      const reply = await callClaude([{ role: "user", content: userText }], BUILD_SYSTEM, { tab: "build" });
      setMsgs([userMsg, { role: "assistant", text: reply }]);
    } catch {
      setMsgs([userMsg, { role: "assistant", text: "Something went wrong." }]);
    }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const newMsgs = [...msgs, { role: "user", text: userText }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const history = newMsgs.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const reply = await callClaude(history, BUILD_SYSTEM, { tab: "build" });
      setMsgs(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", text: "Something went wrong." }]);
    }
    setLoading(false);
  };

  const saveToGallery = () => {
    const title = prompt("Give this concept a name:");
    if (!title) return;
    const problem = prompt("One-line problem it solves:");
    if (!problem) return;
    setGallery(g => [...g, { id: Date.now(), title, problem, status: "Idea", author: "You", date: "Today" }]);
  };

  const statusColor = { "Idea": DM.grey400, "In Discussion": "#F59E0B", "Being Built": DM.green };

  if (phase === "gallery") {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 20, color: DM.black, letterSpacing: "0.04em", marginBottom: 6 }}>CONCEPT GALLERY</div>
            <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey400 }}>Ideas the team has developed. Pick up any concept and keep going.</div>
          </div>
          <Btn onClick={() => setPhase("entry")} style={{ fontSize: 11 }}>+ New concept</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {gallery.map(c => (
            <div key={c.id} onClick={() => setPhase("explore")} style={{ border: `1.5px solid ${DM.grey100}`, borderRadius: 6, padding: "18px 16px", cursor: "pointer", background: DM.white, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = DM.yellow}
              onMouseLeave={e => e.currentTarget.style.borderColor = DM.grey100}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 14, color: DM.black, letterSpacing: "0.04em" }}>{c.title.toUpperCase()}</div>
                <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 8, color: statusColor[c.status] || DM.grey400, background: (statusColor[c.status] || DM.grey400) + "20", padding: "3px 7px", borderRadius: 3 }}>{c.status}</span>
              </div>
              <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, fontWeight: 300, color: DM.grey600, lineHeight: 1.6, marginBottom: 12 }}>{c.problem}</div>
              <div style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400 }}>{c.author} · {c.date}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "entry") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 22, color: DM.black, letterSpacing: "0.04em", marginBottom: 10 }}>BUILD</div>
            <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 13, fontWeight: 300, color: DM.grey600, lineHeight: 1.7, marginBottom: 28 }}>What's something that wastes your time, or something you wish existed?</div>
            <textarea
              value={entryText}
              onChange={e => setEntryText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); startExplore(); } }}
              placeholder="Describe the thing and I'll help you work up the concept..."
              rows={3}
              style={{ width: "100%", border: `1.5px solid ${DM.grey200}`, borderRadius: 4, padding: "12px 14px", fontFamily: "\'Poppins\', sans-serif", fontSize: 13, color: DM.black, lineHeight: 1.5, resize: "none", outline: "none", marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <PrimaryBtn onClick={startExplore} disabled={!entryText.trim()}>EXPLORE THIS</PrimaryBtn>
              <Btn onClick={() => setPhase("gallery")}>View gallery</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${DM.grey100}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={() => { setPhase("entry"); setMsgs([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: DM.grey400, fontFamily: "\'Poppins\', sans-serif", fontSize: 11 }}>← New idea</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <Btn onClick={saveToGallery} style={{ fontSize: 10, padding: "5px 12px" }}>Save to gallery</Btn>
          <Btn onClick={() => { const t = msgs.map(m => (m.role === "user" ? "You: " : "Build: ") + m.text).join("\n\n"); navigator.clipboard.writeText(t); }} style={{ fontSize: 10, padding: "5px 12px" }}>Copy transcript</Btn>
          <Btn onClick={() => setPhase("gallery")} style={{ fontSize: 10, padding: "5px 12px" }}>Gallery</Btn>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => m.role === "user" ? (
          <div key={i} style={{ background: DM.white, border: `1px solid ${DM.grey100}`, borderRadius: 6, padding: "12px 15px", animation: "fadeUp 0.2s ease" }}>
            <Label>You</Label>
            <div style={{ marginTop: 6, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.grey600, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ) : (
          <div key={i} style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 15px", animation: "fadeUp 0.2s ease" }}>
            <Label style={{ color: "#aaa" }}>D+M Build · Explore</Label>
            <div style={{ marginTop: 6, fontFamily: "\'Poppins\', sans-serif", fontSize: 12, fontWeight: 300, color: DM.black, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ background: DM.yellowLight, borderLeft: `3px solid ${DM.yellow}`, borderRadius: "0 6px 6px 0", padding: "12px 15px", display: "flex", alignItems: "center", gap: 8 }}>
            <Spinner size={12} /><span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: "#bbb" }}>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${DM.grey100}`, background: DM.white, flexShrink: 0, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Keep developing the idea..."
          rows={2}
          style={{ flex: 1, border: `1.5px solid ${DM.grey200}`, borderRadius: 4, padding: "9px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, lineHeight: 1.5, resize: "none", outline: "none" }}
        />
        <PrimaryBtn onClick={send} disabled={!input.trim() || loading} style={{ padding: "10px 18px", fontSize: 12 }}>SEND</PrimaryBtn>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

async function verifyPin(pin) {
  const resp = await fetch("/api/check-pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
  return resp.ok;
}

async function submitDocument({ pin, file, title, isGlobal, targets }) {
  const fileBase64 = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
  const resp = await fetch("/api/ingest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin, fileBase64, fileName: file.name, title, isGlobal, targets }) });
  return resp.status === 202;
}

const ALL_TARGETS = [
  { value: "chat", label: "Chat (all)" },
  { value: "sharp", label: "Sharp (all modes)" },
  { value: "brief", label: "Sharp › Brief Sharpener" },
  { value: "insight", label: "Sharp › Insight Developer" },
  { value: "positioning", label: "Sharp › Positioning Developer" },
  { value: "newbiz", label: "Sharp › New Biz Prep" },
  { value: "debrief", label: "Sharp › Debrief Coach" },
  { value: "stimulus", label: "Sharp › Stimulus Challenger" },
  { value: "explorers", label: "Explorers FAQ" },
  { value: "build", label: "Build" },
];

function SettingsPanel({ onClose }) {
  const [pin, setPin] = useState("");
  const [pinStatus, setPinStatus] = useState("idle");
  const [file, setFile] = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [targets, setTargets] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const checkPin = async () => {
    setPinStatus("checking");
    const ok = await verifyPin(pin).catch(() => false);
    setPinStatus(ok ? "ok" : "error");
  };

  const toggleTarget = (val) => setTargets(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val]);

  const handleUpload = async () => {
    if (!file || !docTitle.trim()) { setErrorMsg("Please provide a file and title."); return; }
    if (!isGlobal && targets.length === 0) { setErrorMsg("Select at least one target, or set to Global."); return; }
    if (file.size > 800_000) { setErrorMsg("File too large. Maximum 800KB."); return; }
    setErrorMsg(""); setUploadStatus("uploading");
    try {
      await submitDocument({ pin, file, title: docTitle.trim(), isGlobal, targets });
      setUploadStatus("submitted"); setFile(null); setDocTitle(""); setTargets([]); setIsGlobal(true);
    } catch {
      setUploadStatus("error"); setErrorMsg("Upload failed. Check your connection and try again.");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: DM.white, border: `2px solid ${DM.yellow}`, borderRadius: 6, width: 520, maxHeight: "85vh", overflowY: "auto", padding: "32px 36px", position: "relative", animation: "fadeUp 0.2s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: DM.grey400 }}>×</button>
        <div style={{ fontFamily: "\'Anton\', sans-serif", fontSize: 18, letterSpacing: "0.04em", color: DM.black, marginBottom: 6 }}>SETTINGS</div>
        <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey400, marginBottom: 24 }}>Admin access required to upload knowledge documents.</div>
        {pinStatus !== "ok" && (
          <div style={{ marginBottom: 20 }}>
            <Label style={{ display: "block", marginBottom: 6 }}>Admin PIN</Label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="password" value={pin} onChange={e => { setPin(e.target.value); setPinStatus("idle"); }} onKeyDown={e => e.key === "Enter" && checkPin()} placeholder="Enter PIN" style={{ flex: 1, border: `1.5px solid ${pinStatus === "error" ? DM.red : DM.grey200}`, borderRadius: 4, padding: "8px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, outline: "none" }} />
              <PrimaryBtn onClick={checkPin} disabled={pin.length < 1 || pinStatus === "checking"} style={{ padding: "8px 16px", fontSize: 11 }}>{pinStatus === "checking" ? "..." : "VERIFY"}</PrimaryBtn>
            </div>
            {pinStatus === "error" && <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.red, marginTop: 5 }}>Incorrect PIN.</div>}
          </div>
        )}
        {pinStatus === "ok" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: "8px 12px", background: "#F0FFF4", border: "1px solid #38A169", borderRadius: 4 }}>
              <span style={{ color: DM.green }}>✓</span>
              <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.green }}>PIN verified. Admin access granted.</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ display: "block", marginBottom: 6 }}>Document</Label>
              <label style={{ display: "block", border: `1.5px dashed ${file ? DM.yellow : DM.grey200}`, borderRadius: 4, padding: "14px 16px", cursor: "pointer", background: file ? DM.yellowLight : DM.grey50, transition: "all 0.15s" }}>
                <input type="file" accept=".pdf,.docx,.md,.txt" onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} />
                <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: file ? DM.black : DM.grey400, textAlign: "center" }}>
                  {file ? `✓ ${file.name} (${(file.size / 1024).toFixed(0)}KB)` : "Click to choose file — PDF, DOCX, MD or TXT · max 800KB"}
                </div>
              </label>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ display: "block", marginBottom: 6 }}>Document title</Label>
              <input type="text" value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="e.g. How to Build a Positioning" style={{ width: "100%", border: `1.5px solid ${DM.grey200}`, borderRadius: 4, padding: "8px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black, outline: "none" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ display: "block", marginBottom: 8 }}>Scope</Label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 10 }}>
                <input type="checkbox" checked={isGlobal} onChange={e => setIsGlobal(e.target.checked)} style={{ accentColor: DM.yellow }} />
                <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.black }}>Global — load on every AI call across all tabs</span>
              </label>
              {!isGlobal && (
                <div style={{ paddingLeft: 4 }}>
                  <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey400, marginBottom: 8 }}>Load only in:</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                    {ALL_TARGETS.map(t => (
                      <label key={t.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                        <input type="checkbox" checked={targets.includes(t.value)} onChange={() => toggleTarget(t.value)} style={{ accentColor: DM.yellow }} />
                        <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.black }}>{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errorMsg && <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.red, marginBottom: 12 }}>{errorMsg}</div>}
            {uploadStatus === "submitted" ? (
              <div style={{ padding: "12px 14px", background: "#F0FFF4", border: "1px solid #38A169", borderRadius: 4 }}>
                <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 12, color: DM.green, marginBottom: 4 }}>✓ Document submitted for processing</div>
                <div style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.grey600, lineHeight: 1.6 }}>Your document is being distilled and written to the knowledge base. Live in approximately 30–60 seconds once Netlify redeploys.</div>
                <button onClick={() => setUploadStatus("idle")} style={{ marginTop: 10, background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 4, padding: "5px 12px", fontFamily: "\'Poppins\', sans-serif", fontSize: 11, cursor: "pointer", color: DM.grey600 }}>Upload another</button>
              </div>
            ) : (
              <PrimaryBtn onClick={handleUpload} disabled={!file || !docTitle.trim() || uploadStatus === "uploading"} style={{ width: "100%", fontSize: 12 }}>
                {uploadStatus === "uploading" ? "SUBMITTING..." : "UPLOAD TO KNOWLEDGE BASE"}
              </PrimaryBtn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("sharp");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const TABS = [
    { id: "chat", label: "Chat" },
    { id: "sharp", label: "Sharp" },
    { id: "explorers", label: "Explorers" },
    { id: "collaborate", label: "Collaborate" },
    { id: "build", label: "Build" },
  ];

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "\'Poppins\', sans-serif", background: DM.white }}>
      <style>{`
        @import url(\'https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap\');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D4D4D4; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus, input:focus { border-color: #FFD900 !important; outline: none; }
        button:focus { outline: none; }
      `}</style>

      {/* Header — white */}
      <div style={{ height: 54, background: DM.white, borderBottom: `1px solid ${DM.grey100}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 12, flexShrink: 0 }}>
        <DmLogo height={22} />
        <div style={{ width: 1, height: 20, background: DM.grey200 }} />
        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "6px 13px", borderRadius: 4,
              fontFamily: "\'Poppins\', sans-serif", fontSize: 11, fontWeight: 500,
              border: tab === t.id ? `1.5px solid ${DM.yellow}` : "1.5px solid transparent",
              background: tab === t.id ? DM.yellowMid : "transparent",
              color: tab === t.id ? DM.black : DM.grey400,
              cursor: "pointer", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ border: `1px solid ${DM.grey100}`, borderRadius: 3, padding: "4px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "\'Space Mono\', monospace", fontSize: 9, color: DM.grey400, letterSpacing: "0.06em", textTransform: "uppercase" }}>Project</span>
            <span style={{ fontFamily: "\'Poppins\', sans-serif", fontSize: 11, color: DM.black, fontWeight: 500 }}>HSBC — Trust Study</span>
          </div>
          <div style={{ display: "flex" }}>
            {[["S", DM.yellow, DM.black, 3], ["JK", DM.grey100, DM.grey600, 2], ["RM", DM.grey50, DM.grey400, 1]].map(([init, bg, col, z], i) => (
              <div key={init} style={{ width: 26, height: 26, borderRadius: "50%", background: bg, border: `2px solid ${DM.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: col, marginLeft: i > 0 ? -7 : 0, zIndex: z, position: "relative" }}>{init}</div>
            ))}
          </div>
          <button onClick={() => setSettingsOpen(true)} title="Settings" style={{ marginLeft: 4, background: "none", border: `1px solid ${DM.grey200}`, borderRadius: 4, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: DM.grey400, fontSize: 14, transition: "all 0.15s" }}>⚙</button>
        </div>
      </div>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {tab === "chat" && <ChatTab />}
        {tab === "sharp" && <SharpenTab />}
        {tab === "explorers" && <ExplorersTab />}
        {tab === "collaborate" && <CollaborateTab />}
        {tab === "build" && <BuildTab />}
      </div>
    </div>
  );
}
