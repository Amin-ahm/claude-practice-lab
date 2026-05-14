/* PGS Lab - App root, routing, mode shell. */

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

// ---- Hash router ----
function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [mode, section] = h.split("/");
  const validMode = mode === "p" ? "presenter" : "attendee";
  const validSection = PGS.SECTIONS.find((s) => s.id === section)?.id || "welcome";
  return { mode: validMode, section: validSection };
}

function setHash(mode, section) {
  const prefix = mode === "presenter" ? "p" : "a";
  window.location.hash = `#${prefix}/${section}`;
}

// ---- Attendee section views map ----
const ATTENDEE_VIEWS = {
  welcome: WelcomeSection,
  environment: EnvironmentSection,
  toolbox: ToolboxSection,
  prompts: PromptsSection,
  explainer: ExplainerSection,
  trust: TrustSection,
  code: CodeSection,
  skills: SkillsSection,
  methods: MethodsSection,
  templates: TemplatesSection,
  issues: IssuesSection,
  library: LibrarySection,
  pilot: PilotSection,
  kit: KitSection,
  closing: ClosingSection,
};

// ---- Attendee shell ----
function AttendeeApp({ sectionId, onChangeSection, onSwitchMode }) {
  const { state, markVisited } = useApp();
  const [, setPlaygroundPrompt] = usePlaygroundPrompt();
  const idx = PGS.SECTIONS.findIndex((s) => s.id === sectionId);
  const total = PGS.SECTIONS.length;
  const progress = (idx + 1) / total;
  const View = ATTENDEE_VIEWS[sectionId] || (() => <div>Not found.</div>);
  const section = PGS.SECTIONS[idx];

  useEffectA(() => { markVisited(sectionId); window.scrollTo({ top: 0, behavior: "instant" }); }, [sectionId]);

  const [navOpen, setNavOpen] = useStateA(false);

  const sendToPlayground = (p) => {
    if (typeof p === "string") setPlaygroundPrompt(p);
    onChangeSection("pilot"); // pilot section id == playground
  };

  const jumpTo = (id) => onChangeSection(id);

  return (
    <div className="app">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="row gap-12">
            <Logo />
          </div>
          <div className="row gap-8">
            <Toggle
              value="attendee"
              onChange={(m) => onSwitchMode(m)}
              options={[
                { id: "attendee", label: "Attendee" },
                { id: "presenter", label: "Presenter" },
              ]}
            />
            <button
              className="btn-copy"
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open section menu"
              style={{ padding: "5px 10px" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M2 6h8M2 9h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Sections
            </button>
          </div>
        </div>
        <div className="container container-wide" style={{ paddingBottom: 8, paddingTop: 2 }}>
          <div className="row between gap-12 tiny muted" style={{ marginBottom: 6 }}>
            <span>{section.num} · {section.title}</span>
            <span>{idx + 1} / {total}</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </header>

      {/* Section panel drawer */}
      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(20,18,14,0.4)", zIndex: 50,
            display: "flex", justifyContent: "flex-end", animation: "fadeIn 180ms ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(360px, 90vw)", height: "100%", background: "var(--paper)",
              borderLeft: "1px solid var(--line)", padding: "20px 18px", overflowY: "auto",
              animation: "fadeIn 220ms ease",
            }}
          >
            <div className="row between" style={{ marginBottom: 14 }}>
              <div className="b">Sections</div>
              <button className="btn-copy" type="button" onClick={() => setNavOpen(false)}>Close</button>
            </div>
            <div className="section-list">
              {PGS.SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#a/${s.id}`}
                  className={s.id === sectionId ? "active" : ""}
                  onClick={() => setNavOpen(false)}
                >
                  <span className="num">{s.num}</span>
                  <span>{s.title}</span>
                  {state.visited.includes(s.id) && (
                    <span className="muted tiny" style={{ marginLeft: "auto" }}>visited</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <main className="container" style={{ padding: "28px 20px 96px" }}>
        <div key={sectionId}>
          <View
            onJump={jumpTo}
            onOpenPlayground={() => onChangeSection("pilot")}
            onSendToPlayground={sendToPlayground}
          />
        </div>
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: "sticky", bottom: 0, background: "rgba(247, 244, 238, 0.92)",
        backdropFilter: "blur(10px)", borderTop: "1px solid var(--line)", padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, zIndex: 20,
      }}>
        <button
          className="btn btn-ghost"
          type="button"
          disabled={idx === 0}
          onClick={() => onChangeSection(PGS.SECTIONS[idx - 1].id)}
        >
          ← Prev
        </button>
        <div className="tiny muted" style={{ textAlign: "center", flex: 1 }}>
          <span className="b" style={{ color: "var(--ink)" }}>{section.num}</span> {section.short}
        </div>
        <button
          className="btn btn-accent"
          type="button"
          disabled={idx === total - 1}
          onClick={() => onChangeSection(PGS.SECTIONS[idx + 1].id)}
        >
          Next →
        </button>
      </nav>
    </div>
  );
}

// ---- Root ----
function App() {
  const [route, setRoute] = useStateA(parseHash());
  useEffectA(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) setHash("attendee", "welcome");
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Keyboard nav for presenter
  useEffectA(() => {
    const onKey = (e) => {
      if (route.mode !== "presenter") return;
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      const idx = PGS.SECTIONS.findIndex((s) => s.id === route.section);
      if (e.key === "ArrowRight" && idx < PGS.SECTIONS.length - 1) {
        setHash("presenter", PGS.SECTIONS[idx + 1].id);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        setHash("presenter", PGS.SECTIONS[idx - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [route]);

  const goSection = (s) => setHash(route.mode, s);
  const switchMode = (m) => setHash(m, route.section);

  if (route.mode === "presenter") {
    const idx = PGS.SECTIONS.findIndex((s) => s.id === route.section);
    return (
      <>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="row gap-12"><Logo /></div>
            <Toggle
              value="presenter"
              onChange={(m) => switchMode(m)}
              options={[
                { id: "attendee", label: "Attendee" },
                { id: "presenter", label: "Presenter" },
              ]}
            />
          </div>
        </header>
        <PresenterApp
          sectionId={route.section}
          hasPrev={idx > 0}
          hasNext={idx < PGS.SECTIONS.length - 1}
          onPrev={() => idx > 0 && goSection(PGS.SECTIONS[idx - 1].id)}
          onNext={() => idx < PGS.SECTIONS.length - 1 && goSection(PGS.SECTIONS[idx + 1].id)}
        />
      </>
    );
  }

  return (
    <AttendeeApp
      sectionId={route.section}
      onChangeSection={goSection}
      onSwitchMode={switchMode}
    />
  );
}

// ---- Mount ----
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppStateProvider>
    <App />
  </AppStateProvider>
);
