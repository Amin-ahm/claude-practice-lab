/* PGS Lab — Templates, Issues, Library, Playground (was Pilot), Take-home (was Kit), Closing */

const { useState: useStateB, useMemo: useMemoB, useEffect: useEffectB } = React;

// ============ 11 Workflow Templates ============
function TemplatesSection() {
  const [active, setActive] = useStateB(PGS.TEMPLATES[0].id);
  const t = PGS.TEMPLATES.find((x) => x.id === active);
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="11"
        eyebrow="Templates"
        title="Seven files that keep Claude reviewable."
        sub="Filled-in examples from a fictional PGS scenario. They cohere as a set — read them together. Edit the values, names, and dates for your own task."
      />

      <div className="card-teal">
        <div className="eyebrow" style={{ color: "#14383a", marginBottom: 4 }}>Example project</div>
        <div className="b">{PGS.EXAMPLE_PROJECT.name}</div>
        <div className="small" style={{ marginTop: 4 }}>{PGS.EXAMPLE_PROJECT.summary}</div>
      </div>

      <Tabs
        tabs={PGS.TEMPLATES.map((x) => ({ id: x.id, label: x.name }))}
        active={active}
        onChange={setActive}
      />
      <div className="card fade-in" key={active}>
        <div className="row between wrap gap-12" style={{ marginBottom: 6 }}>
          <h3 style={{ fontSize: 22 }}>{t.name}</h3>
          <Pill tone="dark">{t.id.toUpperCase()}</Pill>
        </div>
        <div className="grid grid-3" style={{ marginTop: 10, marginBottom: 18 }}>
          <div>
            <div className="eyebrow">What it is</div>
            <div className="small" style={{ marginTop: 4 }}>{t.what}</div>
          </div>
          <div>
            <div className="eyebrow">When to use</div>
            <div className="small" style={{ marginTop: 4 }}>{t.when}</div>
          </div>
          <div>
            <div className="eyebrow">Why it helps</div>
            <div className="small" style={{ marginTop: 4 }}>{t.why}</div>
          </div>
        </div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Example .md file</div>
        <PromptBlock copyText={t.template}>{t.template}</PromptBlock>
      </div>
    </div>
  );
}

// ============ 12 Common Issues Lab ============

function IssueExercise({ issue }) {
  const ex = issue.exercise;
  const [singleAns, setSingleAns] = useStateB(null);
  const [multiAns, setMultiAns] = useStateB([]);
  const [freeAns, setFreeAns] = useStateB("");
  const [classifyAns, setClassifyAns] = useStateB({});

  if (!ex) return null;

  if (ex.type === "single") {
    const correct = singleAns != null && singleAns === ex.correct;
    return (
      <div className="card-flat">
        <div className="b" style={{ marginBottom: 8 }}>{ex.question}</div>
        <OptionGroup options={ex.options} value={singleAns} onChange={setSingleAns} stack idKey={"sg-" + issue.id} />
        {singleAns != null && (
          <div className={"fade-in card-" + (correct ? "good" : "warn") + " small"} style={{ marginTop: 10 }}>
            {correct ? "Right. " : "Reconsider. "}{ex.explanation}
          </div>
        )}
      </div>
    );
  }

  if (ex.type === "multi") {
    const all = ex.correct.every((c) => multiAns.includes(c)) && multiAns.length === ex.correct.length;
    return (
      <div className="card-flat">
        <div className="b" style={{ marginBottom: 8 }}>{ex.question}</div>
        <OptionGroup options={ex.options} value={multiAns} onChange={setMultiAns} multi stack idKey={"m-" + issue.id} />
        {multiAns.length > 0 && (
          <div className={"fade-in card-" + (all ? "good" : "warn") + " small"} style={{ marginTop: 10 }}>
            {all ? "All correct. " : "Keep going — there are more. "}{ex.explanation}
          </div>
        )}
      </div>
    );
  }

  if (ex.type === "freeform") {
    return (
      <div className="card-flat">
        <div className="b" style={{ marginBottom: 8 }}>{ex.question}</div>
        {ex.fields ? (
          <div className="col gap-8">
            {ex.fields.map((f, i) => (
              <Field label={f} key={i}>
                <input className="input" />
              </Field>
            ))}
          </div>
        ) : (
          <textarea className="textarea" placeholder={ex.placeholder} value={freeAns} onChange={(e) => setFreeAns(e.target.value)} />
        )}
      </div>
    );
  }

  if (ex.type === "rewrite") {
    return (
      <div className="card-flat">
        <div className="b" style={{ marginBottom: 4 }}>{ex.question}</div>
        <PromptBlock paper copyText={ex.starter}>{ex.starter}</PromptBlock>
        <div className="eyebrow" style={{ marginTop: 12, marginBottom: 4 }}>Better version</div>
        <PromptBlock copyText={ex.target}>{ex.target}</PromptBlock>
      </div>
    );
  }

  if (ex.type === "classify") {
    return (
      <div className="card-flat">
        <div className="b" style={{ marginBottom: 8 }}>{ex.question}</div>
        <div className="col gap-8">
          {ex.items.map((it, i) => {
            const placed = classifyAns[i];
            const correct = placed && placed === it.expected;
            return (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div className="row between wrap gap-8">
                  <div className="small">{it.label}</div>
                  <div className="row gap-4">
                    {ex.buckets.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={"btn btn-sm " + (placed === b.id ? (b.id === it.expected ? "btn-accent" : "") : "btn-ghost")}
                        onClick={() => setClassifyAns({ ...classifyAns, [i]: b.id })}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                {placed && (
                  <div className={"tiny " + (correct ? "" : "muted")} style={{ marginTop: 6, color: correct ? "#1d3e22" : undefined }}>
                    {correct ? "✓ Correct." : `Expected: ${ex.buckets.find(b => b.id === it.expected)?.label}.`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

function IssueCard({ issue, idx, onSendToPlayground }) {
  const [open, setOpen] = useStateB(false);
  return (
    <div className="card" style={{ padding: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", textAlign: "left", padding: "18px 20px", background: "transparent", border: "none", font: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
      >
        <div className="row gap-12 items-start" style={{ flex: 1 }}>
          <div className="mono tiny muted shrink-0" style={{ width: 28 }}>{String(idx + 1).padStart(2, "0")}</div>
          <div>
            <div className="b">{issue.title}</div>
            <div className="small muted" style={{ marginTop: 2 }}>{issue.experience}</div>
          </div>
        </div>
        <span style={{ color: "var(--ink-3)", transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>

      {open && (
        <div className="fade-in" style={{ padding: "0 20px 20px", borderTop: "1px solid var(--line)" }}>
          <div className="col" style={{ gap: 14, paddingTop: 16 }}>
            <div>
              <div className="eyebrow">Why it happens</div>
              <div className="small" style={{ marginTop: 4 }}>{issue.why}</div>
            </div>
            <div>
              <div className="eyebrow">Fix</div>
              <ul className="small" style={{ paddingLeft: 18, margin: "4px 0 0" }}>
                {issue.fix.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <div className="compare-grid">
              <div>
                <div className="bad-good-head"><Pill tone="bad">Bad prompt</Pill></div>
                <PromptBlock paper copyText={issue.bad}>{issue.bad}</PromptBlock>
              </div>
              <div>
                <div className="bad-good-head"><Pill tone="good">Better prompt</Pill></div>
                <PromptBlock copyText={issue.better}>{issue.better}</PromptBlock>
                <div className="row gap-8 wrap" style={{ marginTop: 10 }}>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => onSendToPlayground && onSendToPlayground(issue.better)}>
                    Open in Playground →
                  </button>
                </div>
              </div>
            </div>
            <IssueExercise issue={issue} />
          </div>
        </div>
      )}
    </div>
  );
}

function IssuesSection({ onSendToPlayground }) {
  const [filter, setFilter] = useStateB("");
  const filtered = PGS.ISSUES.filter((i) => !filter || i.title.toLowerCase().includes(filter.toLowerCase()) || i.experience.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="col" style={{ gap: 18 }}>
      <SectionTitle
        num="12"
        eyebrow="Common issues lab"
        title="What goes wrong, and the fix."
        sub="Each card: what users experience, why it happens, the fix, and a quick exercise. Tap one open."
      />
      <input
        className="input"
        placeholder="Filter issues… (e.g. 'code', 'terms', 'confident')"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="col gap-8">
        {filtered.map((iss) => (
          <IssueCard
            key={iss.id}
            issue={iss}
            idx={PGS.ISSUES.indexOf(iss)}
            onSendToPlayground={onSendToPlayground}
          />
        ))}
        {filtered.length === 0 && (
          <div className="card-flat small muted">No issues match "{filter}".</div>
        )}
      </div>
    </div>
  );
}

// ============ 13 Example Library ============
function LibrarySection({ onSendToPlayground }) {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="13"
        eyebrow="Library"
        title="Examples to copy, adapt, run."
        sub="Generic PGS-style examples. Replace the input with your own real (but sanitized) data."
      />
      <div className="col gap-12">
        {PGS.EXAMPLES.map((ex, i) => (
          <div className="card" key={ex.id}>
            <div className="row between wrap gap-8" style={{ marginBottom: 10 }}>
              <div className="row gap-8 items-start">
                <span className="mono tiny muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ fontSize: 18 }}>{ex.title}</h3>
              </div>
              <Pill>Example</Pill>
            </div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Input</div>
            <div className="card-flat mono small" style={{ whiteSpace: "pre-wrap", marginBottom: 12 }}>{ex.input}</div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Prompt</div>
            <PromptBlock copyText={ex.prompt}>{ex.prompt}</PromptBlock>
            <div className="row gap-8 wrap" style={{ marginTop: 12 }}>
              <ClaudeRunner prompt={`${ex.prompt}\n\nInput:\n"""\n${ex.input}\n"""`} label="Run this with Claude" compact />
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => onSendToPlayground && onSendToPlayground(`${ex.prompt}\n\nInput:\n"""\n${ex.input}\n"""`)}>
                Open in Playground
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div>
        <SectionTitle eyebrow="Team sharing" title="From individual experiments to shared team assets." />
        <div className="grid grid-2">
          <div className="card">
            <Pill tone="dark">Shared prompt</Pill>
            <div className="b" style={{ marginTop: 10 }}>Simple repeatable instructions.</div>
            <div className="small muted" style={{ marginTop: 4 }}>"Explain this file to someone from another department."</div>
          </div>
          <div className="card">
            <Pill tone="dark">Shared Project</Pill>
            <div className="b" style={{ marginTop: 10 }}>Team context, examples, glossary.</div>
            <div className="small muted" style={{ marginTop: 4 }}>"PGS Claude Practice Lab Project" with examples and pilot cards.</div>
          </div>
          <div className="card">
            <Pill tone="accent">Shared Artifact</Pill>
            <div className="b" style={{ marginTop: 10 }}>Interactive tools and mini-apps.</div>
            <div className="small muted" style={{ marginTop: 4 }}>This workshop, checklist generators, glossary builders.</div>
          </div>
          <div className="card">
            <Pill tone="teal">Shared Skill</Pill>
            <div className="b" style={{ marginTop: 10 }}>Repeatable workflows.</div>
            <div className="small muted" style={{ marginTop: 4 }}>Cross-Department Explainer or Handoff Checklist Builder.</div>
          </div>
        </div>
        <div className="card-warn small" style={{ marginTop: 18 }}>
          <span className="b">Sharing follows company policy.</span> Don't share sensitive content unless approved for that audience.
        </div>
      </div>
    </div>
  );
}

// ============ 14 Playground (replaces Pilot) ============
function PilotSection() {
  const [prompt, setPrompt] = usePlaygroundPrompt();
  const [activePreset, setActivePreset] = useStateB(PGS.PRESETS[0].id);

  useEffectB(() => {
    // First-time visitor sees a useful preset
    if (!prompt) {
      setPrompt(PGS.PRESETS[0].prompt);
      setActivePreset(PGS.PRESETS[0].id);
    }
  }, []); // eslint-disable-line

  const loadPreset = (p) => {
    setActivePreset(p.id);
    setPrompt(p.prompt);
  };

  return (
    <div className="col" style={{ gap: 22 }}>
      <SectionTitle
        num="14"
        eyebrow="Playground"
        title="Try Claude live."
        sub="Pick a preset or write your own. Hit Run. See what Claude actually returns. This is where the patterns from earlier sections become real."
      />

      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Presets — tap to load</div>
        <div className="grid grid-2">
          {PGS.PRESETS.map((p) => {
            const active = p.id === activePreset;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPreset(p)}
                className="card"
                style={{
                  textAlign: "left", cursor: "pointer", font: "inherit",
                  background: active ? "var(--ink)" : "var(--surface)",
                  color: active ? "#f4efe3" : "var(--ink)",
                  border: active ? "1px solid var(--ink)" : "1px solid var(--line)",
                  padding: 14,
                }}
              >
                <div className="b">{p.title}</div>
                <div className="small" style={{ marginTop: 4, color: active ? "rgba(244,239,227,0.7)" : "var(--ink-3)" }}>{p.blurb}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card col gap-8">
        <Field label="Your prompt">
          <textarea
            className="textarea"
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); setActivePreset(null); }}
            placeholder="Paste or write a prompt. Pro tip: include context, goal, audience, output format, and 'do not approve'."
            style={{ minHeight: 240, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.55 }}
          />
        </Field>
        <div className="row between wrap gap-8">
          <div className="tiny muted">{prompt.length.toLocaleString()} characters</div>
          <div className="row gap-8 wrap">
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => setPrompt("")}>Clear</button>
            <CopyButton text={prompt} label="Copy prompt" />
          </div>
        </div>
        <div style={{ marginTop: 4 }}>
          <ClaudeRunner prompt={prompt} label="Run with Claude" />
        </div>
      </div>

      <div className="card-warn small">
        <span className="b">Sanitize before you paste.</span> Replace IDs, names, secrets, customer or operator details with placeholders. Follow company policy.
      </div>
    </div>
  );
}

// ============ 15 Take-home pack (replaces Kit) ============
function KitSection({ onSendToPlayground }) {
  const phaseTemplate = PGS.TEMPLATES.find((t) => t.id === "phase").template;
  const todoTemplate  = PGS.TEMPLATES.find((t) => t.id === "todo").template;
  const checklistTpl  = PGS.TEMPLATES.find((t) => t.id === "checklist").template;
  const promptCardTpl = PGS.TEMPLATES.find((t) => t.id === "prompt-card").template;
  const skillSeedTpl  = PGS.TEMPLATES.find((t) => t.id === "skill-seed").template;

  const troubleshoot = `# My Claude Troubleshooting Checklist

When Claude gives a bad answer, check:

${PGS.TROUBLESHOOT.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;

  const fullPack = `# PGS Claude — Take-home Pack

────────────────────────────────
## Phase prompt
${phaseTemplate}

────────────────────────────────
## TODO.md
${todoTemplate}

────────────────────────────────
## Checklist
${checklistTpl}

────────────────────────────────
## Prompt card
${promptCardTpl}

────────────────────────────────
## Skill seed
${skillSeedTpl}

────────────────────────────────
${troubleshoot}`;

  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="15"
        eyebrow="Take-home"
        title="Take this with you."
        sub="Generic templates + a troubleshooting checklist + six concrete pilot starters. Copy what fits, ignore the rest."
      />

      <div className="card-accent row between wrap gap-12 items-stretch">
        <div>
          <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>One file, all of it</div>
          <div className="b" style={{ marginTop: 4 }}>Copy the whole take-home pack.</div>
          <div className="small" style={{ marginTop: 4 }}>Paste into your notes app or share with your team lead.</div>
        </div>
        <div className="row gap-8">
          <CopyButton text={fullPack} label="Copy full pack" />
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Six pilot ideas — pick one, run it this week</div>
        <div className="col gap-12">
          {PGS.PILOT_IDEAS.map((p, i) => (
            <div key={p.id} className="card">
              <div className="row between wrap gap-12" style={{ marginBottom: 6 }}>
                <div className="row gap-12 items-start">
                  <span className="mono tiny muted shrink-0" style={{ width: 22, marginTop: 4 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="b">{p.title}</div>
                    <div className="small muted" style={{ marginTop: 2 }}>{p.who}</div>
                  </div>
                </div>
                <div className="row gap-6 wrap">
                  <Pill>{p.effort}</Pill>
                  <Pill tone="teal">Risk: {p.risk}</Pill>
                </div>
              </div>
              <div className="small" style={{ marginTop: 6 }}><span className="b">Why try it: </span><span className="muted">{p.why}</span></div>
              <div style={{ marginTop: 10 }}>
                <PromptBlock copyText={p.prompt}>{p.prompt}</PromptBlock>
              </div>
              <div className="row gap-8 wrap" style={{ marginTop: 10 }}>
                <ClaudeRunner prompt={p.prompt} label="Try it" compact />
                <button className="btn btn-ghost btn-sm" type="button" onClick={() => onSendToPlayground && onSendToPlayground(p.prompt)}>
                  Open in Playground
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Templates — individual copies</div>
        <div className="grid grid-2">
          <CopyCard title="Phase prompt"      body={phaseTemplate} />
          <CopyCard title="TODO.md"           body={todoTemplate} />
          <CopyCard title="CHECKLIST.md"      body={checklistTpl} />
          <CopyCard title="Prompt Card"       body={promptCardTpl} />
          <CopyCard title="Skill seed"        body={skillSeedTpl} />
          <CopyCard title="Troubleshooting"   body={troubleshoot} />
        </div>
      </div>
    </div>
  );
}

function CopyCard({ title, body }) {
  const [open, setOpen] = useStateB(false);
  return (
    <div className="card">
      <div className="row between gap-8" style={{ marginBottom: 6 }}>
        <div className="b">{title}</div>
        <CopyButton text={body} />
      </div>
      <button
        type="button"
        className="btn-copy"
        onClick={() => setOpen((v) => !v)}
        style={{ marginBottom: 8 }}
      >
        {open ? "Hide preview" : "Preview"}
      </button>
      {open && (
        <pre className="code-paper code small fade-in" style={{ maxHeight: 220, overflow: "auto", fontSize: 12 }}>{body}</pre>
      )}
    </div>
  );
}

// ============ 16 Closing ============
function ClosingSection() {
  return (
    <div className="col" style={{ gap: 24 }}>
      <SectionTitle
        num="16"
        eyebrow="Close"
        title="Leave with one safe pilot."
        sub="Don't try to automate everything. Pick one repeated task that is low-risk, annoying, and easy to verify. If it works twice, share it."
      />
      <div className="card-ink">
        <div className="display" style={{ fontSize: 28, fontStyle: "italic", lineHeight: 1.2 }}>
          Claude drafts.<br/>Owners decide.
        </div>
        <div style={{ marginTop: 10, color: "#d6cfbe", fontSize: 15 }}>
          Good workflows make Claude useful, reviewable, and safe.
        </div>
      </div>
      <div className="grid grid-3">
        <div className="card-flat">
          <div className="eyebrow">Now</div>
          <div className="b" style={{ marginTop: 4 }}>Copy the pack.</div>
          <div className="small muted">Save it to your notes or send it to yourself.</div>
        </div>
        <div className="card-flat">
          <div className="eyebrow">This week</div>
          <div className="b" style={{ marginTop: 4 }}>Run one pilot once.</div>
          <div className="small muted">One real task. Sanitize the input. Verify the output.</div>
        </div>
        <div className="card-flat">
          <div className="eyebrow">In two weeks</div>
          <div className="b" style={{ marginTop: 4 }}>Share what worked.</div>
          <div className="small muted">If the prompt was useful twice, propose a Prompt Card or shared Project to your team.</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  TemplatesSection, IssuesSection, LibrarySection,
  PilotSection, KitSection, ClosingSection,
});
