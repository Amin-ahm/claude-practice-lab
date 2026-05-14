/* PGS Lab - shared UI primitives. Exposes components on window. */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Copy button ----------
function CopyButton({ text, label = "Copy", style }) {
  const [copied, setCopied] = useState(false);
  const onClick = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // fallback
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button className={"btn-copy" + (copied ? " copied" : "")} onClick={onClick} style={style} type="button">
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><path d="M2 8V2.5C2 2.224 2.224 2 2.5 2H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

// ---------- Prompt block (code with copy button) ----------
function PromptBlock({ children, paper = false, copyText, lang }) {
  const text = copyText ?? (typeof children === "string" ? children : "");
  return (
    <div className={"code" + (paper ? " code-paper" : "")}>
      {text && <CopyButton text={text} />}
      {lang && <div className="tiny muted" style={{ marginBottom: 6, fontFamily: "var(--font-mono)" }}>{lang}</div>}
      {children}
    </div>
  );
}

// ---------- Toast ----------
function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

// ---------- Pill / Badge ----------
function Pill({ children, tone = "" }) {
  return <span className={"pill " + (tone ? `pill-${tone}` : "")}>{children}</span>;
}

// ---------- Section title block ----------
function SectionTitle({ num, eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="section-eyebrow">
        {num && <span className="section-eyebrow-num">{num}</span>}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      </div>
      <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: sub ? 10 : 0 }}>{title}</h2>
      {sub && <p style={{ color: "var(--ink-2)", fontSize: 17, lineHeight: 1.5, maxWidth: 640 }}>{sub}</p>}
    </div>
  );
}

// ---------- Options (multi/single chips) ----------
function OptionGroup({ options, value, onChange, multi = false, stack = false, idKey }) {
  const cls = "options" + (stack ? " options-stack" : "");
  const isSelected = (i) => multi ? (value || []).includes(i) : value === i;
  const toggle = (i) => {
    if (!multi) { onChange(i); return; }
    const cur = new Set(value || []);
    if (cur.has(i)) cur.delete(i); else cur.add(i);
    onChange([...cur].sort((a,b)=>a-b));
  };
  return (
    <div className={cls}>
      {options.map((opt, i) => (
        <label key={idKey ? `${idKey}-${i}` : i} className={"option" + (isSelected(i) ? " checked" : "")}>
          <input type={multi ? "checkbox" : "radio"} checked={isSelected(i)} onChange={() => toggle(i)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

// ---------- Scale (numeric 1..N) ----------
function Scale({ n = 5, value, onChange, labelLow = "Low", labelHigh = "High" }) {
  return (
    <div>
      <div className="scale">
        {Array.from({ length: n }, (_, i) => i + 1).map((v) => (
          <button
            key={v}
            type="button"
            className={"scale-item" + (value === v ? " checked" : "")}
            onClick={() => onChange(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="row between tiny muted" style={{ marginTop: 6 }}>
        <span>{labelLow}</span>
        <span>{labelHigh}</span>
      </div>
    </div>
  );
}

// ---------- Field ----------
function Field({ label, hint, children }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

// ---------- Progress bar ----------
function ProgressBar({ value }) {
  return (
    <div className="progress" aria-hidden>
      <div className="progress-bar" style={{ transform: `scaleX(${Math.max(0, Math.min(1, value))})` }} />
    </div>
  );
}

// ---------- Tabs ----------
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={"tab" + (active === t.id ? " active" : "")}
          onClick={() => onChange(t.id)}
          role="tab"
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Accordion ----------
function Accordion({ items, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? null);
  return (
    <div className="col" style={{ gap: 8 }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="card" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "16px 18px",
                background: "transparent", border: "none", font: "inherit",
                fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
              }}
            >
              <span>{it.title}</span>
              <span style={{ color: "var(--ink-3)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--line)" }} className="fade-in">
                <div style={{ paddingTop: 14 }}>{it.body}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Logo / mark ----------
function Logo({ small = false }) {
  return (
    <div className="logo">
      <span className="logo-mark">
        <svg viewBox="0 0 24 24">
          <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--ink)"/>
          <circle cx="8" cy="12" r="2.4" fill="var(--accent)"/>
          <rect x="14" y="6.4" width="2.4" height="11.2" rx="1.2" fill="#fdf7eb"/>
        </svg>
      </span>
      {!small && (
        <>
          <span className="logo-text">PGS&nbsp;Claude&nbsp;Practice&nbsp;Lab</span>
          <span className="logo-text-mobile">PGS&nbsp;Claude&nbsp;Lab</span>
        </>
      )}
    </div>
  );
}

// ---------- QR code (real, encodes the join URL) ----------
function QRPlaceholder({ url, size = 280 }) {
  // Default: this page's own URL with #a/welcome so attendees land in attendee mode
  const target = useMemo(() => {
    if (url) return url;
    if (typeof window === "undefined") return "";
    return window.location.origin + window.location.pathname + "#a/welcome";
  }, [url]);

  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    // qrcode-generator library is loaded via CDN - global `qrcode`.
    if (typeof window.qrcode !== "function") {
      svgRef.current.innerHTML = `<text x="50%" y="50%" text-anchor="middle" font-family="monospace" font-size="11" fill="#6b665d">QR library loading…</text>`;
      return;
    }
    try {
      const qr = window.qrcode(0, "M");
      qr.addData(target);
      qr.make();
      const moduleCount = qr.getModuleCount();
      const cell = 1; // we use viewBox so this is just a unit
      const margin = 2;
      const total = moduleCount + margin * 2;
      let path = "";
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.isDark(r, c)) {
            path += `M${c + margin},${r + margin}h1v1h-1z`;
          }
        }
      }
      svgRef.current.innerHTML = `<rect width="100%" height="100%" fill="#ffffff"/><path d="${path}" fill="#1a1a18"/>`;
      svgRef.current.setAttribute("viewBox", `0 0 ${total} ${total}`);
    } catch (e) {
      svgRef.current.innerHTML = `<text x="50%" y="50%" text-anchor="middle" font-family="monospace" font-size="11" fill="#8a2f2a">QR error: ${e.message}</text>`;
    }
  }, [target]);

  // Truncate visible URL for display
  const displayUrl = (target || "").replace(/^https?:\/\//, "").replace(/#.*$/, "");
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, padding: 14, background: "#fff",
        border: "1px solid var(--line-2)", borderRadius: 16,
      }}>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1 1" shapeRendering="crispEdges"></svg>
      </div>
      <div className="mono tiny muted" style={{ maxWidth: size, textAlign: "center", wordBreak: "break-all" }}>
        {displayUrl || "scan to join"}
      </div>
    </div>
  );
}

// ---------- Hook: localStorage state ----------
function useLocalState(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return initial;
      return JSON.parse(raw);
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

// ---------- App state context (global pilot data) ----------
const AppStateContext = React.createContext(null);

const DEFAULT_STATE = {
  // Only thing we still track: which sections the attendee has opened.
  visited: [],
};

function AppStateProvider({ children }) {
  const [state, setState] = useLocalState("pgs-lab-state-v2", DEFAULT_STATE);
  const markVisited = useCallback((id) => {
    setState((s) => s.visited.includes(id) ? s : { ...s, visited: [...s.visited, id] });
  }, [setState]);
  const reset = useCallback(() => setState(DEFAULT_STATE), [setState]);

  const value = { state, markVisited, reset };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
function useApp() { return React.useContext(AppStateContext); }

// ---------- Timer (mm:ss countdown) ----------
function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const tick = useRef(null);
  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(tick.current);
  }, [running]);
  const reset = (s) => { setSeconds(s ?? initialSeconds); setRunning(false); };
  const fmt = useMemo(() => {
    const sign = seconds < 0 ? "-" : "";
    const abs = Math.abs(seconds);
    const m = Math.floor(abs / 60).toString();
    const s = (abs % 60).toString().padStart(2, "0");
    return `${sign}${m}:${s}`;
  }, [seconds]);
  return { seconds, running, setRunning, reset, fmt, over: seconds < 0 };
}

// ---------- Toggle ----------
function Toggle({ value, onChange, options }) {
  return (
    <div className="mode-toggle">
      {options.map((o) => (
        <button key={o.id} className={value === o.id ? "active" : ""} onClick={() => onChange(o.id)} type="button">
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Claude Runner ----------
// Shows a pre-baked example response with a short simulated delay.
// The live API isn't reachable from a static GitHub Pages build, so we
// embed realistic outputs at each call site via the `exampleOutput` prop.
function ClaudeRunner({ prompt, exampleOutput, label = "Run with Claude", compact = false, hint }) {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    if (!prompt || !prompt.trim()) {
      setError("Prompt is empty. Paste or write a prompt first.");
      return;
    }
    if (!exampleOutput) {
      setError("No example response is set for this prompt. Edit the prompt back to one of the presets, or copy it into Claude directly.");
      return;
    }
    setRunning(true); setError(null); setOutput("");
    await new Promise((r) => setTimeout(r, 650 + Math.random() * 400));
    setOutput(exampleOutput);
    setRunning(false);
  };

  const clear = () => { setOutput(""); setError(null); };

  return (
    <div className="col gap-8">
      <div className="row gap-8 wrap items-stretch">
        <button
          type="button"
          className={"btn btn-accent " + (compact ? "btn-sm" : "")}
          onClick={run}
          disabled={running}
        >
          {running ? (
            <>
              <span className="spin" aria-hidden style={{ display: "inline-block", width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 700ms linear infinite" }} />
              <span>Running…</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 1.8L10 6L2.5 10.2V1.8Z" fill="currentColor"/></svg>
              <span>{label}</span>
            </>
          )}
        </button>
        {(output || error) && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>
        )}
        {hint && <span className="tiny muted" style={{ alignSelf: "center" }}>{hint}</span>}
      </div>
      {error && (
        <div className="card-bad small">
          <span className="b">Couldn't run: </span>{error}
        </div>
      )}
      {output && (
        <div className="card-flat fade-in">
          <div className="row between gap-8" style={{ marginBottom: 8 }}>
            <div className="eyebrow">Example response</div>
            <span className="pill" style={{ background: "var(--paper-2)" }}>pre-recorded</span>
          </div>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.55 }}>{output}</div>
          <div className="row" style={{ marginTop: 10, justifyContent: "flex-end" }}>
            <CopyButton text={output} label="Copy response" />
          </div>
        </div>
      )}
    </div>
  );
}

// Hook: shared playground prompt state across the app
function usePlaygroundPrompt() {
  return useLocalState("pgs-playground-prompt", "");
}

Object.assign(window, { ClaudeRunner, usePlaygroundPrompt });

Object.assign(window, {
  CopyButton, PromptBlock, Toast, Pill, SectionTitle,
  OptionGroup, Scale, Field, ProgressBar, Tabs, Accordion,
  Logo, QRPlaceholder, AppStateProvider, useApp, useLocalState, useTimer, Toggle,
});
