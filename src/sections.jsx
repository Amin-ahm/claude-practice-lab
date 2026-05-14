/* PGS Lab - Attendee section views. Playground-first, light on forms. */

const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS } = React;

// ---------- 01 Welcome (no form - just the value prop + map of what's inside) ----------
function WelcomeSection({ onJump }) {
  const map = [
    { t: "See what good looks like",     d: "Side-by-side bad vs better prompts, with the actual fixes that make Claude useful.",                  go: "prompts" },
    { t: "Try Claude live",              d: "Open the Playground. Pick a preset. Hit Run. See what Claude actually returns.",                       go: "pilot" },
    { t: "Find what fits your work",     d: "Cross-department explainer, code patterns, skill seeds - pick the one closest to your day.",           go: "toolbox" },
    { t: "Avoid the common traps",       d: "15 ways Claude answers go wrong, with the fix and a 30-second exercise for each.",                    go: "issues" },
    { t: "Copy what you need",           d: "Templates for phases, TODO.md, checklists, prompt cards. A take-home pack of pilot ideas.",            go: "templates" },
  ];
  return (
    <div className="col" style={{ gap: 26 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>PGS · Internal workshop</div>
        <h1 className="display" style={{ fontSize: "clamp(34px, 6vw, 56px)", lineHeight: 1.02 }}>
          <span className="display-i">A practical lab</span><br/>for working with Claude.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, marginTop: 18, color: "var(--ink-2)", maxWidth: 580 }}>
          You already have Claude Team. The interesting question isn't <em>can</em> you use Claude - it's where it actually helps your workflow, and how to keep it reviewable. Browse around. Try things. Take what's useful.
        </p>
      </div>

      <div className="card-accent">
        <div className="row gap-12 items-start">
          <div style={{ fontSize: 28, lineHeight: 1, marginTop: 2 }}>→</div>
          <div>
            <div className="b">Today's goal: one safe pilot per person.</div>
            <div className="small" style={{ marginTop: 4 }}>
              Not full adoption. Not a deep dive on AI. Pick one repeated, low-risk, easy-to-verify task you do - and leave with a prompt that handles it.
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>What's in here</div>
        <div className="col gap-8">
          {map.map((m, i) => (
            <button
              key={m.t}
              type="button"
              className="card"
              onClick={() => onJump && onJump(m.go)}
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--line)", background: "var(--surface)", padding: 16, font: "inherit" }}
            >
              <div className="row between gap-12">
                <div className="row gap-12 items-start">
                  <span className="mono tiny muted shrink-0" style={{ width: 22, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="b">{m.t}</div>
                    <div className="small muted" style={{ marginTop: 2 }}>{m.d}</div>
                  </div>
                </div>
                <span style={{ color: "var(--ink-3)", fontSize: 18 }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card-ink">
        <div className="display" style={{ fontSize: 24, fontStyle: "italic", lineHeight: 1.15 }}>
          Claude drafts. Owners decide.
        </div>
        <div className="small" style={{ marginTop: 8, color: "#d6cfbe" }}>
          Claude is good for prepare, compare, summarize, explain, draft, test, organize. It is not for approving math, compliance, production releases, or department decisions.
        </div>
      </div>
    </div>
  );
}

// ---------- 02 Environment - info-only ----------
function EnvironmentSection() {
  const map = [
    { t: "Projects",        d: "Shared context, files, instructions, glossaries." },
    { t: "Artifacts",       d: "Interactive mini-apps and visual explainers - like this workshop." },
    { t: "Skills",          d: "Repeatable workflows packaged with rules, examples, and output format." },
    { t: "Claude Code",     d: "Coding help, when scoped and tested." },
    { t: "Shared library",  d: "Vetted prompts the team can copy and improve." },
  ];
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="02"
        eyebrow="The environment"
        title="You already have Claude Team."
        sub={`The adoption question is not "can people access Claude?" It's: can we create reusable Projects, Artifacts, and Skills that make Claude useful in real workflows? Where company settings allow it, those can be shared.`}
      />
      <div className="grid grid-3">
        {map.map((m, i) => (
          <div className="card" key={m.t}>
            <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ marginTop: 4 }}>{m.t}</div>
            <div className="small muted" style={{ marginTop: 4 }}>{m.d}</div>
          </div>
        ))}
      </div>
      <div className="card-teal">
        <div className="eyebrow" style={{ color: "#14383a", marginBottom: 6 }}>Key message</div>
        <div style={{ fontSize: 17 }}>
          Do not make every person rediscover good prompting alone. Create shared examples and reusable workflows.
        </div>
      </div>
      <div className="card-warn small">
        <span className="b">Sharing follows company policy.</span> Don't share sensitive content unless approved for that audience.
      </div>
    </div>
  );
}

// ---------- 03 Toolbox - info-only, no form ----------
function ToolboxSection() {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="03"
        eyebrow="Toolbox"
        title="What Claude can - and shouldn't - help with."
      />
      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Useful patterns</div>
        <div className="grid grid-2">
          {PGS.TOOLBOX_HELPS.map((x, i) => (
            <div className="card" key={i}>
              <div className="row gap-8 items-start">
                <div className="mono tiny muted shrink-0" style={{ minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="b">{x.t}</div>
                  <div className="small muted" style={{ marginTop: 2 }}>{x.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-ink">
        <div className="eyebrow" style={{ color: "#e8c8a5", marginBottom: 10 }}>What Claude should NOT do alone</div>
        <ul className="col" style={{ gap: 6, paddingLeft: 18, margin: 0 }}>
          {PGS.TOOLBOX_AVOID.map((x) => <li key={x} style={{ fontSize: 15 }}>{x}</li>)}
        </ul>
      </div>
    </div>
  );
}

// ---------- 04 Bad → better with live runners on both ----------
function PromptsSection({ onOpenPlayground }) {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="04"
        eyebrow="Prompt craft"
        title="Bad prompt → better prompt."
        sub="Most disappointing answers trace back to a prompt that was too short. Same input - try both."
      />

      <div className="compare-grid">
        <div>
          <div className="bad-good-head"><Pill tone="bad">Bad prompt</Pill></div>
          <PromptBlock paper copyText={PGS.BAD_PROMPT_S5}>{PGS.BAD_PROMPT_S5}</PromptBlock>
          <ul className="small muted" style={{ marginTop: 10, paddingLeft: 18 }}>
            {PGS.BAD_PROMPT_S5_WHY.map((w) => <li key={w}>{w}</li>)}
          </ul>
          <div style={{ marginTop: 12 }}>
            <ClaudeRunner
              prompt={`${PGS.BAD_PROMPT_S5}\n\n[A made-up file about updated game config values.]`}
              exampleOutput={PGS.EXAMPLE_OUTPUTS["bad-prompt"]}
              label="Run the bad prompt"
              compact
              hint="Watch how generic the answer feels."
            />
          </div>
        </div>
        <div>
          <div className="bad-good-head"><Pill tone="good">Better prompt</Pill></div>
          <PromptBlock copyText={PGS.BETTER_PROMPT_S5}>{PGS.BETTER_PROMPT_S5}</PromptBlock>
          <div style={{ marginTop: 12 }}>
            <ClaudeRunner
              prompt={`${PGS.BETTER_PROMPT_S5}\n\nContext:\nA configuration file from the QA team showing the v4 paytable for a sample slot game.\n\nThe file contains:\n- gameId: "sample-game"\n- rtp: 95.0\n- poolType: "standard"\n- ticketTag: "base_v3"\n- featureEnabled: true`}
              exampleOutput={PGS.EXAMPLE_OUTPUTS["better-prompt"]}
              label="Run the better prompt"
              compact
              hint="Notice the structure, the assumptions, the questions for the owner."
            />
          </div>
        </div>
      </div>

      <div className="card-flat row between wrap gap-12 items-stretch">
        <div>
          <div className="b">Want to try your own?</div>
          <div className="small muted">The Playground has presets and a blank slate.</div>
        </div>
        <button className="btn btn-ghost" type="button" onClick={() => onOpenPlayground && onOpenPlayground()}>Open Playground →</button>
      </div>
    </div>
  );
}

// ---------- 05 Cross-department explainer - direct, with Run ----------
function ExplainerSection({ onSendToPlayground }) {
  const [showExample, setShowExample] = useStateS(false);
  const fullPrompt = `${PGS.EXPLAINER_PROMPT}\n\nFile / note:\n"""\n${PGS.EXPLAINER_EXAMPLE_INPUT}\n"""`;
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="05"
        eyebrow="Cross-team"
        title="Translate a file from another team."
        sub="Math, V2, iGaming, QA, Dev, PM - different terms and assumptions. Claude is the translator, not the decider."
      />
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>The template</div>
        <PromptBlock copyText={PGS.EXPLAINER_PROMPT}>{PGS.EXPLAINER_PROMPT}</PromptBlock>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Example input</div>
        <div className="card-flat mono small" style={{ whiteSpace: "pre-wrap" }}>{PGS.EXPLAINER_EXAMPLE_INPUT}</div>
      </div>
      <div className="row gap-8 wrap">
        <ClaudeRunner prompt={fullPrompt} exampleOutput={PGS.EXAMPLE_OUTPUTS["explainer-run"]} label="Run on the example" compact />
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => onSendToPlayground && onSendToPlayground(fullPrompt)}>
          Open in Playground
        </button>
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowExample((v) => !v)}>
          {showExample ? "Hide" : "Show"} a sample answer
        </button>
      </div>
      {showExample && (
        <div className="fade-in">
          <div className="eyebrow" style={{ marginBottom: 8 }}>A sample Claude response (for reference)</div>
          <PromptBlock paper copyText={PGS.EXPLAINER_EXAMPLE_OUTPUT}>{PGS.EXPLAINER_EXAMPLE_OUTPUT}</PromptBlock>
        </div>
      )}
    </div>
  );
}

// ---------- 06 Trust - light interaction: 1-tap reveal ----------
function TrustSection() {
  const [revealed, setRevealed] = useStateS(false);
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="06"
        eyebrow="Trust"
        title="Trust is earned through verification."
        sub="Claude output is not trusted because it sounds confident. It is trusted when it is grounded, reviewable, and easy to verify."
      />
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 10 }}>The trust checklist</div>
        <div className="grid grid-2" style={{ gap: 8 }}>
          {PGS.TRUST_CHECKLIST.map((c) => (
            <div key={c} className="card-flat small">✓ {c}</div>
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>A bad Claude output</div>
        <div className="card-bad mono small" style={{ whiteSpace: "pre-wrap" }}>{PGS.TRUST_BAD_OUTPUT}</div>
      </div>
      <button className="btn btn-ghost" type="button" onClick={() => setRevealed((v) => !v)}>
        {revealed ? "Hide" : "Why is this unsafe?"}
      </button>
      {revealed && (
        <div className="fade-in card-warn small">
          <span className="b">Six reasons:</span> too confident · no evidence · no extracted values · no assumptions listed · no human review · makes an approval decision Claude shouldn't make. A safer answer would extract values, identify assumptions, list missing information, and ask for owner review.
        </div>
      )}
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>A safer answer template</div>
        <PromptBlock paper copyText={PGS.TRUST_SAFER_OUTPUT}>{PGS.TRUST_SAFER_OUTPUT}</PromptBlock>
      </div>
    </div>
  );
}

// ---------- 07 Claude Code - show patterns, no picker ----------
function CodeSection() {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="07"
        eyebrow="Claude Code"
        title="Small, scoped, testable."
        sub="Claude Code should not start with 'build everything.' It starts with a small task, sample input and output, tests, and a review."
      />
      <div className="compare-grid">
        <div>
          <div className="bad-good-head"><Pill tone="bad">Bad request</Pill></div>
          <PromptBlock paper copyText={PGS.CODE_BAD}>{PGS.CODE_BAD}</PromptBlock>
        </div>
        <div>
          <div className="bad-good-head"><Pill tone="good">Better request</Pill></div>
          <PromptBlock copyText={PGS.CODE_BETTER}>{PGS.CODE_BETTER}</PromptBlock>
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>A concrete example - config validator</div>
        <PromptBlock copyText={PGS.CODE_VALIDATOR_EXAMPLE}>{PGS.CODE_VALIDATOR_EXAMPLE}</PromptBlock>
        <div style={{ marginTop: 12 }}>
          <ClaudeRunner prompt={PGS.CODE_VALIDATOR_EXAMPLE} exampleOutput={PGS.EXAMPLE_OUTPUTS["code-validator"]} label="Run it" compact hint="See how Claude scopes a small utility with tests." />
        </div>
      </div>
    </div>
  );
}

// ---------- 08 Skills - info-only ----------
function SkillsSection() {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="08"
        eyebrow="Skills"
        title="When a prompt earns its keep, package it."
        sub="A Skill is for when the team repeatedly asks Claude to follow the same workflow, rules, or output format. Don't start with Skills - start with a prompt. If it works more than once, graduate it."
      />
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 10 }}>Skill examples worth packaging</div>
        <div className="grid grid-3">
          {PGS.SKILL_EXAMPLES.map((s, i) => (
            <div key={s} className="card-flat">
              <div className="mono tiny muted">{String(i + 1).padStart(2, "0")}</div>
              <div className="b" style={{ marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Skill starter template - paste, fill in, save as a markdown file</div>
        <PromptBlock copyText={PGS.SKILL_TEMPLATE}>{PGS.SKILL_TEMPLATE}</PromptBlock>
      </div>
      <div className="card-flat small">
        <span className="b">Seed pattern: </span>
        <span className="mono">When I give Claude [input], I want it to always [behavior], and never [risk].</span>
      </div>
    </div>
  );
}

// ---------- 09 Methods - info-only ----------
function MethodsSection() {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="09"
        eyebrow="Methods"
        title="How to work with Claude without getting lost."
        sub="Don't ask Claude to solve a large messy task in one shot. Give it a small operating system: phases, a todo list, acceptance criteria, and a verification loop."
      />
      <div className="card-teal">
        <div className="eyebrow" style={{ color: "#14383a", marginBottom: 6 }}>Core message</div>
        <div style={{ fontSize: 17, lineHeight: 1.45 }}>
          Phases prevent rushing. <span className="mono">TODO.md</span> keeps you aligned. <span className="mono">PLAN.md</span> shows the approach before changes. <span className="mono">CHECKLIST.md</span> turns implicit knowledge into a visible review. <span className="mono">CONTEXT.md</span> bridges terminology gaps.
        </div>
      </div>
      <div className="grid grid-2">
        {[
          { t: "Understand", d: "Claude summarizes the input and asks clarifying questions." },
          { t: "Plan",       d: "Claude proposes steps before doing work." },
          { t: "Draft",      d: "Claude creates the first version." },
          { t: "Review",     d: "Claude checks its own output against criteria." },
          { t: "Human approval", d: "The responsible person decides." },
          { t: "Package",    d: "Claude creates the final shareable output, checklist, prompt, or Skill seed." },
        ].map((p, i) => (
          <div className="card" key={p.t}>
            <div className="mono tiny muted">PHASE {String(i + 1).padStart(2, "0")}</div>
            <div className="b" style={{ marginTop: 4 }}>{p.t}</div>
            <div className="small muted" style={{ marginTop: 4 }}>{p.d}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Maturity ladder</div>
        <div className="card col" style={{ gap: 10 }}>
          {PGS.MATURITY.map((m, i) => (
            <div className="row gap-12 items-start" key={m.lvl}>
              <span className="mono tiny muted shrink-0" style={{ width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <div className="row gap-12 items-start" style={{ flex: 1, flexWrap: "wrap" }}>
                <div className="b shrink-0" style={{ minWidth: 180 }}>{m.lvl}</div>
                <div className="small muted">{m.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Phase prompt - copy & adapt</div>
        <PromptBlock copyText={PGS.TEMPLATES[0].template}>{PGS.TEMPLATES[0].template}</PromptBlock>
      </div>
    </div>
  );
}

Object.assign(window, {
  WelcomeSection, EnvironmentSection,
  ToolboxSection, PromptsSection, ExplainerSection,
  TrustSection, CodeSection, SkillsSection, MethodsSection,
});
