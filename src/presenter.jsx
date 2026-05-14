/* PGS Lab - Presenter Mode. Sequential, projection-friendly views. */

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

// Presenter has its own simplified, projection-friendly screen per section.
// We keep it visually distinct from attendee mode: huge display type, generous space, less chrome.

function PSlideShell({ idx, total, section, children }) {
  const t = useTimer(section.min * 60);
  useEffectP(() => { t.reset(section.min * 60); }, [section.id]); // reset on section change
  return (
    <div className="presenter-stage">
      <div className="presenter-meta">
        <div className="row gap-12 items-stretch">
          <span className="presenter-section-label">{section.num} · {section.short}</span>
          <span className="pill">{idx + 1} / {total}</span>
        </div>
        <div className="row gap-8 items-stretch">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => t.setRunning(!t.running)}>
            {t.running ? "Pause" : "Start"} timer
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => t.reset()}>Reset</button>
          <div className={"presenter-timer" + (t.over ? " over" : "")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="8" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 5V8L9 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M5 2H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <span>{t.fmt}</span>
            <span className="muted" style={{ fontSize: 11 }}>/ {section.min}m</span>
          </div>
        </div>
      </div>

      <div className="presenter-body">{children}</div>
    </div>
  );
}

// --- Per-section presenter screens (lighter than attendee, designed for projection) ---

function PWelcome() {
  return (
    <div className="row gap-24 items-stretch" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 380px", minWidth: 320 }}>
        <h1 className="presenter-title display">
          <span className="display-i">Welcome to</span><br/>
          PGS Claude<br/>Practice Lab.
        </h1>
        <p className="presenter-subtitle" style={{ marginTop: 18 }}>
          Scan the QR to open the lab on your phone. We're here to find
          one safe Claude pilot per attendee - not full adoption overnight.
        </p>
      </div>
      <div className="row items-stretch" style={{ flex: "0 0 auto", alignItems: "center" }}>
        <QRPlaceholder />
      </div>
    </div>
  );
}

function PEnvironment() {
  return (
    <div>
      <h1 className="presenter-title display">We already have <span className="display-i">the environment.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        PGS provides Claude Team membership. The question is not "can people access Claude?" It's: can we build reusable Projects, Artifacts, and Skills that make Claude useful in real workflows?
      </p>
      <div className="grid grid-3" style={{ marginTop: 32 }}>
        {[
          { t: "Projects",  d: "Shared context & knowledge spaces" },
          { t: "Artifacts", d: "Shareable tools & visual explainers" },
          { t: "Skills",    d: "Repeatable workflows packaged as instructions" },
          { t: "Claude Code", d: "Safer coding help when scoped & tested" },
          { t: "Claude Design", d: "Interactive training materials" },
          { t: "Shared Library", d: "Vetted prompts the team can copy" },
        ].map((x, i) => (
          <div className="card" key={i}>
            <div className="mono tiny muted">0{i + 1}</div>
            <div className="b" style={{ fontSize: 19, marginTop: 6 }}>{x.t}</div>
            <div className="muted small" style={{ marginTop: 4 }}>{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PToolbox() {
  return (
    <div>
      <h1 className="presenter-title display">What Claude can <span className="display-i">help with.</span></h1>
      <div className="grid grid-4" style={{ marginTop: 32 }}>
        {PGS.TOOLBOX_HELPS.map((x, i) => (
          <div className="card" key={i}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ fontSize: 18, marginTop: 4 }}>{x.t}</div>
            <div className="muted small" style={{ marginTop: 2 }}>{x.d}</div>
          </div>
        ))}
      </div>
      <div className="card-ink" style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ color: "#e8c8a5", marginBottom: 10 }}>Claude should NOT do alone</div>
        <div className="row gap-8 wrap">
          {PGS.TOOLBOX_AVOID.map((x) => <span key={x} className="pill" style={{ background: "rgba(255,255,255,0.06)", color: "#f1ebde", border: "1px solid rgba(255,255,255,0.12)" }}>{x}</span>)}
        </div>
      </div>
    </div>
  );
}

function PPrompts() {
  return (
    <div>
      <h1 className="presenter-title display">Bad prompt → <span className="display-i">better prompt.</span></h1>
      <div className="compare-grid" style={{ marginTop: 32, gap: 18 }}>
        <div>
          <div className="bad-good-head"><Pill tone="bad">Bad prompt</Pill></div>
          <PromptBlock paper copyText={PGS.BAD_PROMPT_S5}>{PGS.BAD_PROMPT_S5}</PromptBlock>
          <div className="card-flat small" style={{ marginTop: 10 }}>
            <span className="b">Why it fails: </span>
            {PGS.BAD_PROMPT_S5_WHY.join(" · ")}
          </div>
        </div>
        <div>
          <div className="bad-good-head"><Pill tone="good">Better prompt</Pill></div>
          <PromptBlock copyText={PGS.BETTER_PROMPT_S5}>{PGS.BETTER_PROMPT_S5}</PromptBlock>
        </div>
      </div>
    </div>
  );
}

function PExplainer() {
  return (
    <div>
      <h1 className="presenter-title display">Cross-department <span className="display-i">explainer.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Math, V2, iGaming, QA, Dev, PM - different terms, different assumptions. Claude is the translator, not the decider.
      </p>
      <div className="grid grid-2" style={{ marginTop: 28, gap: 18 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Template</div>
          <PromptBlock copyText={PGS.EXPLAINER_PROMPT}>{PGS.EXPLAINER_PROMPT}</PromptBlock>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Example input</div>
          <div className="card-flat mono small" style={{ whiteSpace: "pre-wrap" }}>{PGS.EXPLAINER_EXAMPLE_INPUT}</div>
          <div className="eyebrow" style={{ marginTop: 14, marginBottom: 8 }}>Claude's response (excerpt)</div>
          <div className="card-flat mono small" style={{ whiteSpace: "pre-wrap" }}>{PGS.EXPLAINER_EXAMPLE_OUTPUT.split("\n").slice(0, 10).join("\n")}…</div>
        </div>
      </div>
    </div>
  );
}

function PTrust() {
  return (
    <div>
      <h1 className="presenter-title display">Trust is earned <span className="display-i">through verification.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Claude output is not trusted because it sounds confident. It is trusted when it is grounded, reviewable, and easy to verify.
      </p>
      <div className="grid grid-2" style={{ marginTop: 28, gap: 18 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Trust checklist</div>
          <div className="col gap-8">
            {PGS.TRUST_CHECKLIST.map((c) => (
              <div key={c} className="card-flat small">✓ {c}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>A bad answer</div>
          <div className="card-bad mono small" style={{ whiteSpace: "pre-wrap" }}>{PGS.TRUST_BAD_OUTPUT}</div>
          <div className="eyebrow" style={{ marginTop: 14, marginBottom: 8 }}>The safer pattern</div>
          <PromptBlock paper copyText={PGS.TRUST_SAFER_OUTPUT}>{PGS.TRUST_SAFER_OUTPUT}</PromptBlock>
        </div>
      </div>
    </div>
  );
}

function PCode() {
  return (
    <div>
      <h1 className="presenter-title display">Claude Code: <span className="display-i">small, scoped, tested.</span></h1>
      <div className="compare-grid" style={{ marginTop: 28, gap: 18 }}>
        <div>
          <div className="bad-good-head"><Pill tone="bad">Bad request</Pill></div>
          <PromptBlock paper copyText={PGS.CODE_BAD}>{PGS.CODE_BAD}</PromptBlock>
        </div>
        <div>
          <div className="bad-good-head"><Pill tone="good">Better request</Pill></div>
          <PromptBlock copyText={PGS.CODE_BETTER}>{PGS.CODE_BETTER}</PromptBlock>
        </div>
      </div>
    </div>
  );
}

function PSkills() {
  return (
    <div>
      <h1 className="presenter-title display">Skills come <span className="display-i">after</span> proof.</h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Don't start with Skills. Start with a prompt. If it works twice, make it a Prompt Card. If a team uses it three times, package it as a Skill.
      </p>
      <div className="grid grid-3" style={{ marginTop: 28 }}>
        {PGS.SKILL_EXAMPLES.map((s, i) => (
          <div className="card" key={s}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ fontSize: 18, marginTop: 4 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PMethods() {
  return (
    <div>
      <h1 className="presenter-title display">Working with Claude <span className="display-i">without getting lost.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Give Claude a small operating system: phases, a todo list, acceptance criteria, and a verification loop.
      </p>
      <div className="grid grid-3" style={{ marginTop: 28 }}>
        {[
          { t: "Phases",       d: "Understand → Plan → Draft → Review → Approve → Package" },
          { t: "TODO.md",      d: "Persistent task tracker humans + Claude both update" },
          { t: "PLAN.md",      d: "Approach before any changes" },
          { t: "CHECKLIST.md", d: "Repeatable review pattern from team knowledge" },
          { t: "CONTEXT.md",   d: "Glossary + boundaries + audience" },
          { t: "Prompt Card",  d: "Shareable, vetted prompt template" },
        ].map((x, i) => (
          <div className="card" key={x.t}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ fontSize: 18, marginTop: 4 }}>{x.t}</div>
            <div className="muted small" style={{ marginTop: 2 }}>{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PTemplates() {
  return (
    <div>
      <h1 className="presenter-title display">Seven templates. <span className="display-i">Copy. Adapt.</span></h1>
      <div className="grid grid-4" style={{ marginTop: 28 }}>
        {PGS.TEMPLATES.map((t, i) => (
          <div className="card" key={t.id}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ fontSize: 17, marginTop: 4 }}>{t.name}</div>
            <div className="muted small" style={{ marginTop: 2 }}>{t.what}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PIssues() {
  return (
    <div>
      <h1 className="presenter-title display">Common issues, <span className="display-i">honest fixes.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Pick the two or three most likely to bite this room. Read the "why it happens" line out loud.
      </p>
      <div className="grid grid-2" style={{ marginTop: 28, gap: 12 }}>
        {PGS.ISSUES.slice(0, 10).map((iss, i) => (
          <div className="card" key={iss.id}>
            <div className="row gap-12 items-start">
              <div className="mono tiny muted shrink-0" style={{ width: 28 }}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="b" style={{ fontSize: 16 }}>{iss.title}</div>
                <div className="muted small" style={{ marginTop: 2 }}>{iss.experience}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PLibrary() {
  return (
    <div>
      <h1 className="presenter-title display">Examples to <span className="display-i">copy and adapt.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Generic PGS-style examples. Show one or two live. Tell attendees: copy, adapt, bring back what you learned.
      </p>
      <div className="grid grid-3" style={{ marginTop: 28 }}>
        {PGS.EXAMPLES.map((ex, i) => (
          <div className="card" key={ex.id}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ fontSize: 17, marginTop: 4 }}>{ex.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PPilot() {
  return (
    <div>
      <h1 className="presenter-title display"><span className="display-i">Try</span> Claude live.</h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Open the Playground on your phone. Pick a preset. Hit Run. Take 5 minutes to actually try something - pick the preset closest to your own work.
      </p>
      <div className="grid grid-3" style={{ marginTop: 28 }}>
        {PGS.PRESETS.filter(p => p.id !== "freestyle").map((p, i) => (
          <div className="card" key={p.id}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ fontSize: 17, marginTop: 4 }}>{p.title}</div>
            <div className="muted small" style={{ marginTop: 4 }}>{p.blurb}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PKit() {
  return (
    <div>
      <h1 className="presenter-title display">Take-home <span className="display-i">pack.</span></h1>
      <p className="presenter-subtitle" style={{ marginTop: 14 }}>
        Six concrete pilot ideas - pick one to run this week. Generic templates for phases, TODO.md, checklists, prompt cards, Skill seeds. A troubleshooting checklist.
      </p>
      <div className="grid grid-3" style={{ marginTop: 28 }}>
        {PGS.PILOT_IDEAS.map((p, i) => (
          <div className="card-flat" key={p.id}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ marginTop: 4 }}>{p.title}</div>
            <div className="muted small" style={{ marginTop: 4 }}>{p.who}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PClosing() {
  return (
    <div>
      <div className="display display-i" style={{ fontSize: "clamp(18px, 1.6vw, 22px)", color: "var(--ink-3)" }}>Closing</div>
      <h1 className="presenter-title display" style={{ marginTop: 8 }}>
        <span className="display-i">Leave with</span><br/>one safe pilot.
      </h1>
      <p className="presenter-subtitle" style={{ marginTop: 18, maxWidth: 760 }}>
        Don't try to automate everything. Pick one repeated task that is low-risk, annoying, and easy to verify.
        Share your pilot. If it works twice, propose a Prompt Card or shared Project.
      </p>
      <div className="card-ink" style={{ marginTop: 32, display: "inline-block" }}>
        <div className="display" style={{ fontSize: 38, fontStyle: "italic", lineHeight: 1.1 }}>
          Claude drafts.<br/>Owners decide.
        </div>
      </div>
    </div>
  );
}

const PRESENTER_VIEWS = {
  welcome: PWelcome, environment: PEnvironment,
  toolbox: PToolbox, prompts: PPrompts, explainer: PExplainer,
  trust: PTrust, code: PCode, skills: PSkills, methods: PMethods,
  templates: PTemplates, issues: PIssues, library: PLibrary,
  pilot: PPilot, kit: PKit, closing: PClosing,
};

function PresenterApp({ sectionId, onPrev, onNext, hasPrev, hasNext }) {
  const idx = PGS.SECTIONS.findIndex((s) => s.id === sectionId);
  const section = PGS.SECTIONS[idx];
  const View = PRESENTER_VIEWS[sectionId] || (() => <div>Section not found</div>);
  return (
    <div className="presenter">
      <PSlideShell idx={idx} total={PGS.SECTIONS.length} section={section}>
        <div className="fade-in" key={sectionId}><View /></div>
      </PSlideShell>
      <div className="presenter-stage" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <div className="presenter-footer">
          <div className="row gap-8">
            <button className="btn btn-ghost" type="button" disabled={!hasPrev} onClick={onPrev}>← Prev</button>
            <button className="btn btn-accent" type="button" disabled={!hasNext} onClick={onNext}>Next →</button>
          </div>
          <div className="row gap-6 wrap">
            {PGS.SECTIONS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={"stepper-dot" + (i === idx ? " active" : i < idx ? " done" : "")}
                onClick={() => window.location.hash = `#p/${s.id}`}
                title={`${s.num} · ${s.short}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PresenterApp });
