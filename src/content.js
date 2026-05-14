/* PGS Claude Practice Lab - content data (no JSX). Attached to window.PGS */

window.PGS = (function () {

  const SECTIONS = [
    { id: "welcome",       num: "01", min: 5, title: "Welcome",                              short: "Welcome" },
    { id: "environment",   num: "02", min: 5, title: "Claude Team and shared assets",        short: "Team" },
    { id: "toolbox",       num: "03", min: 6, title: "Claude toolbox",                       short: "Toolbox" },
    { id: "prompts",       num: "04", min: 7, title: "Bad prompt vs better prompt",          short: "Prompts" },
    { id: "explainer",     num: "05", min: 7, title: "Cross-department explainer",           short: "Explainer" },
    { id: "trust",         num: "06", min: 8, title: "Trust and verification",               short: "Trust" },
    { id: "code",          num: "07", min: 7, title: "Claude Code safe-use pattern",         short: "Code" },
    { id: "skills",        num: "08", min: 5, title: "Skills as reusable workflows",         short: "Skills" },
    { id: "methods",       num: "09", min: 6, title: "Working with Claude without getting lost", short: "Methods" },
    { id: "templates",     num: "10", min: 4, title: "Workflow templates",                   short: "Templates" },
    { id: "issues",        num: "11", min: 5, title: "Common issues lab",                    short: "Issues" },
    { id: "library",       num: "12", min: 4, title: "Example library",                      short: "Library" },
    { id: "pilot",         num: "13", min: 6, title: "Playground: try Claude live",          short: "Playground" },
    { id: "kit",           num: "14", min: 3, title: "Take-home pack",                       short: "Take-home" },
    { id: "closing",       num: "15", min: 1, title: "Leave with one safe pilot",            short: "Close" },
  ];

  // Example-project metadata - used as the scenario for every filled-in .md template below.
  // All templates below are written as if they're real files inside this fictional project,
  // so attendees see a coherent set rather than a pile of blank placeholders.
  const EXAMPLE_PROJECT = {
    name: "sample-game v4 paytable handoff",
    summary: "Math handed off the v4 paytable for sample-game on Tuesday. Friday release target. QA needs regression. PM needs release-readiness. Multiple departments need to align before sign-off.",
  };

  const TOOLBOX_HELPS = [
    { t: "Summarize", d: "Long notes, threads, specs - into the few things that matter." },
    { t: "Compare",   d: "Two versions of a file, config, or spec - what changed and why it matters." },
    { t: "Explain",   d: "A file from another department - in plain language, with terms to confirm." },
    { t: "Draft",     d: "Follow-up questions, emails, agendas, handoff notes - for a human to edit." },
    { t: "Review",    d: "Run your own work through a structured checklist before sharing it." },
    { t: "Checklist", d: "Turn implicit knowledge into a visible checklist anyone can run." },
    { t: "Small tested code", d: "Parsers, validators, formatters - scoped and tested, not production-wide." },
    { t: "Skill",     d: "When you do the same task a third time, package it as a Skill." },
  ];

  const TOOLBOX_AVOID = [
    "Approve math",
    "Approve compliance",
    "Decide release readiness",
    "Make production changes without review",
    "Replace department owners",
    "Treat assumptions as facts",
  ];

  const BAD_PROMPT_S5 = `Check this file.`;

  const BAD_PROMPT_S5_WHY = [
    "No context",
    "No audience",
    "No goal",
    "No output format",
    "No safety boundary",
    "No verification criteria",
  ];

  const BETTER_PROMPT_S5 = `You are helping me review a file from another PGS department.

Context:
[What this file is and where it came from]

Audience:
[I am technical, but not familiar with this specific workflow]

Goal:
Help me understand what matters and what I should ask the owner.

Return:
1. Plain-English summary
2. Important details
3. Assumptions
4. Questions for the owner
5. Items that need human review

Do not approve or finalize anything.`;

  const EXPLAINER_PROMPT = `I received this file or note from another department.
Explain it to me as someone who is technical but not familiar with this specific workflow.

Return:
1. What it appears to be
2. Why it might matter
3. Terms I should understand
4. Questions I should ask the owner
5. What I should not assume

Do not make approval decisions.`;

  const EXPLAINER_EXAMPLE_INPUT = `The pool file was regenerated after the latest paytable adjustment. Simulator output needs to be compared against the expected RTP before downstream validation continues.`;

  const EXPLAINER_EXAMPLE_OUTPUT = `Plain-English explanation:
A source file used for validation was updated after a paytable change. Before other teams continue, the updated output needs to be checked against the expected target.

Terms to confirm:
- Pool file
- Paytable adjustment
- Simulator output
- Expected RTP
- Downstream validation

Questions for the owner:
1. What changed in the paytable?
2. Which version of the pool file is current?
3. What expected target should be used?
4. Who signs off before validation continues?

Do not assume:
- That the new file is approved
- That the target is unchanged
- That downstream teams can proceed without owner confirmation`;

  const TRUST_CHECKLIST = [
    "Did Claude use the input I provided?",
    "Did it extract actual values or details?",
    "Did it separate facts from assumptions?",
    "Did it identify unknowns?",
    "Did it list questions for the owner?",
    "Did it avoid approval decisions?",
    "Did a human owner review it?",
    "For code, are there tests?",
  ];

  const TRUST_BAD_OUTPUT = `Everything looks correct. The RTP is fine and this should be approved.`;

  const TRUST_BAD_REASONS = [
    "Too confident",
    "No evidence",
    "No extracted values",
    "No assumptions listed",
    "No human review",
    "Makes an approval decision Claude should not make",
  ];

  const TRUST_SAFER_OUTPUT = `I cannot approve this. Here is what I can do:

Facts found in the input:
- [Extracted fact]

Assumptions:
- [Assumption]

Unknowns:
- [Missing information]

Questions for the owner:
1. [Question]
2. [Question]

Recommended next check:
- Have the responsible department verify the source values and approval criteria.`;

  const CODE_BAD = `Build a tool that validates everything and fixes all issues automatically.`;

  const CODE_BETTER = `Create a small utility for this specific task only.

Goal:
[Describe the task]

Inputs:
[Describe sample input]

Expected output:
[Describe output]

Rules:
1. List assumptions before coding.
2. Write tests.
3. Include sample input and expected output.
4. Do not modify existing production files.
5. Explain how to verify the result.`;

  const CODE_VALIDATOR_EXAMPLE = `Create a small config validation utility.

Goal:
Read one sample JSON config and report missing fields, unexpected fields, and values that need owner confirmation.

Input:
A local sample JSON file pasted into the chat.

Expected output:
A table with field, value, status, and question for owner.

Rules:
1. List assumptions before writing code.
2. Do not modify any files.
3. Include sample input and expected output.
4. Write unit tests for valid input, missing fields, and invalid types.
5. Explain how a human should verify the result.
6. Do not claim the config is approved.`;

  const SKILL_EXAMPLES = [
    "Cross-Department Explainer",
    "Handoff Checklist Builder",
    "Meeting Notes to Action Items",
    "Review Questions Generator",
    "Safe Code Utility Builder",
    "Department Glossary Assistant",
  ];

  const SKILL_TEMPLATE = `# [Skill Name]

Use this skill when: [use case]

Claude should:
- [behavior]
- [behavior]
- [behavior]

Claude must not:
- [risk]
- [risk]
- [risk]

Output format:
1. Summary
2. Important details
3. Assumptions
4. Questions for owner
5. Human review required`;

  // ---------- Common Issues Lab ----------
  const ISSUES = [
    {
      id: "generic",
      title: "Claude gives generic answers",
      experience: "Claude gives vague, generic, or obvious output.",
      why: "The prompt lacks context, audience, goal, output format, examples, and constraints.",
      fix: ["Role", "Context", "Goal", "Input type", "Audience", "Output format", "What not to do", "Review criteria"],
      bad: `Summarize this.`,
      better: `You are helping me prepare for a cross-department review.

Context:
This is a note or file from another PGS department.

Goal:
Help me understand what changed and what questions I should ask.

Return:
1. Plain-English summary
2. Important details
3. Assumptions
4. Questions for the owner
5. Items that need human review

Do not approve or finalize anything.`,
      exercise: {
        type: "multi",
        question: `What is missing from "Check this config."?`,
        options: ["Context", "Goal", "Output format", "Safety boundary"],
        correct: [0, 1, 2, 3],
        explanation: "All of the above. A useful prompt names context, goal, output shape, and what Claude should not do.",
      },
    },
    {
      id: "confident",
      title: "Claude sounds confident but may be wrong",
      experience: "A fluent answer that sounds correct - but may include silent assumptions.",
      why: "Fluent output hides missing information. Claude may fill gaps unless told not to.",
      fix: ["Ask Claude to separate facts, assumptions, unknowns, and questions."],
      bad: `Everything looks correct. This should be approved.`,
      better: `Before giving suggestions, separate your response into:

1. Facts found directly in the input
2. Assumptions you are making
3. Unknowns or missing information
4. Questions for the owner
5. Suggested next steps

Do not present assumptions as facts.`,
      exercise: {
        type: "multi",
        question: `Why is "Everything looks correct. This should be approved." unsafe?`,
        options: ["Too confident", "No evidence cited", "No human review", "Makes an approval decision"],
        correct: [0, 1, 2, 3],
        explanation: "All four. Confidence without evidence + an approval decision Claude shouldn't make.",
      },
    },
    {
      id: "code-quality",
      title: "Claude code is low quality",
      experience: "Code does not work, does too much, lacks tests, or does not match team conventions.",
      why: "The task is too broad. No sample input, no expected output, no acceptance criteria, no tests, no instruction to avoid production changes.",
      fix: ["Use a small, testable, reviewable coding request."],
      bad: `Build the whole pipeline.`,
      better: `Create a small utility for this specific task only.

Goal:
[Describe task]

Inputs:
[Describe sample input]

Expected output:
[Describe output]

Rules:
1. List assumptions before coding.
2. Write tests.
3. Include sample input and expected output.
4. Do not modify existing production files.
5. Explain how to verify the result.`,
      exercise: {
        type: "single",
        question: `Which is safer for a first Claude Code task?`,
        options: [
          "Refactor the whole module to be cleaner.",
          "Write a small parser for one file format, with sample input, expected output, and tests.",
        ],
        correct: 1,
        explanation: "Small + scoped + testable + verifiable. Big rewrites come later, after trust.",
      },
    },
    {
      id: "forgets",
      title: "Claude forgets instructions halfway through",
      experience: "Claude starts well but later ignores earlier constraints or changes direction.",
      why: "The task may be too large, the chat may be too long, or rules were not restated.",
      fix: ["Break work into phases.", "Restate important rules."],
      bad: `Review everything and fix all issues.`,
      better: `We will do this in phases.

Phase 1:
Understand the file and summarize it.

Phase 2:
List risks and open questions.

Phase 3:
Only after I confirm, draft the final output.

Important rules:
- Do not approve anything.
- Separate facts from assumptions.
- Ask before making changes.`,
      exercise: {
        type: "single",
        question: `Which is safer?`,
        options: [
          "Review everything and fix all issues.",
          "First inspect the file and list potential issues. Do not change anything yet.",
        ],
        correct: 1,
        explanation: "Inspect first, change later. Phase prompts keep Claude reviewable.",
      },
    },
    {
      id: "terms",
      title: "Claude does not understand department terminology",
      experience: "Claude misunderstands internal terms, abbreviations, or department-specific language.",
      why: "Internal language is implicit. Different departments may use the same words differently.",
      fix: ["Add a local glossary block.", "Ask Claude to mark unclear terms instead of guessing."],
      bad: `Explain this.`,
      better: `Use this glossary for this task:

- [Term 1]: [Meaning]
- [Term 2]: [Meaning]
- [Term 3]: [Meaning]

If a term is unclear, do not guess. Put it under "Terms to confirm."`,
      exercise: {
        type: "freeform",
        question: "Write three terms from your department another team might misunderstand.",
        placeholder: "Term - what it means in your team\nTerm - what it means\nTerm - what it means",
      },
    },
    {
      id: "process",
      title: "Claude's answer does not match our process",
      experience: "Claude gives generally correct advice that doesn't fit your team's actual workflow or approval process.",
      why: "Claude defaults to general best practices unless you provide process boundaries.",
      fix: ["Provide the workflow steps.", "State Claude's role and what it must not do."],
      bad: `What should I do here?`,
      better: `Our process:
1. [Step]
2. [Step]
3. [Step]

Claude's role:
- Help prepare
- Help compare
- Help summarize
- Help draft questions

Claude must not:
- Approve
- Decide release readiness
- Override department owner`,
      exercise: {
        type: "freeform",
        question: "Fill in one line each:",
        fields: [
          "In my workflow, Claude can help with:",
          "Claude should not:",
          "A human owner must review:",
        ],
      },
    },
    {
      id: "start",
      title: "People do not know where to start",
      experience: `People hear "use AI" but do not know what task to try first.`,
      why: `"Use AI" is too broad. People need one low-risk, concrete starting point.`,
      fix: ["The one-task pilot rule: pick one repeated task that is annoying, low-risk, and easy to verify."],
      bad: `Use AI more.`,
      better: `Pick one repeated task this week. Use Claude to draft the boring part. A human verifies the result. If it works twice, share the prompt.`,
      exercise: {
        type: "classify",
        question: "Classify each example.",
        items: [
          { label: "Summarize meeting notes",                expected: "safe" },
          { label: "Approve math sign-off",                  expected: "no" },
          { label: "Compare two configs and list diffs",     expected: "safe" },
          { label: "Decide release readiness alone",         expected: "no" },
          { label: "Draft test cases for human review",      expected: "safe" },
          { label: "Rewrite production code unsupervised",   expected: "no" },
          { label: "Explain another team's file to me",      expected: "safe" },
          { label: "Validate compliance alone",              expected: "no" },
          { label: "Generate a follow-up checklist",         expected: "safe" },
          { label: "Replace a department review",            expected: "no" },
        ],
        buckets: [
          { id: "safe",    label: "Safe starting point" },
          { id: "caution", label: "Needs caution" },
          { id: "no",      label: "Not appropriate" },
        ],
      },
    },
    {
      id: "sensitive",
      title: "Sensitive information concerns",
      experience: "People are unsure what information can be pasted into Claude.",
      why: "They may not know company policy, data classification, or whether a file contains secrets.",
      fix: ["Follow company policy.", "When unsure, sanitize the example or ask the owner before pasting."],
      bad: `(pastes raw production data)`,
      better: `Use a sanitized example. Replace IDs, names, and secrets with placeholders. Ask the responsible owner if the file is OK to share with Claude.`,
      exercise: {
        type: "multi",
        question: "What might need to be removed before pasting an example into Claude?",
        options: [
          "Credentials",
          "Private tokens",
          "Personal information",
          "Customer or operator-sensitive details",
          "Production secrets",
          "Anything company policy restricts",
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explanation: "All of these. When in doubt, sanitize or ask the owner.",
      },
    },
    {
      id: "wall",
      title: "Claude gives too much text",
      experience: "Claude returns a long wall of text you have to scan.",
      why: "The prompt does not constrain format, length, audience, or priority.",
      fix: ["Ask for a specific output shape.", "Cap length. Specify audience."],
      bad: `Explain this in detail.`,
      better: `Return a short table with:
- Issue
- Why it matters
- Owner to confirm
- Suggested question

Maximum 8 rows.
Use plain language.`,
      exercise: {
        type: "rewrite",
        question: `Rewrite "Explain this in detail."`,
        starter: `Explain this in detail.`,
        target: `Explain this in 5 bullets for someone from another department. Include only risks and questions.`,
      },
    },
    {
      id: "stuck",
      title: "Claude asks too many questions or gets stuck",
      experience: "Claude asks follow-ups instead of producing a useful draft.",
      why: "You didn't tell Claude how to handle missing information.",
      fix: ["Tell Claude when to proceed and when to stop."],
      bad: `Ask me anything you need.`,
      better: `If information is missing:
- Do not stop immediately.
- Make reasonable assumptions only if low-risk.
- Mark assumptions clearly.
- Continue with a draft.
- List what needs confirmation.
- Only ask me if the missing information blocks the task.`,
      exercise: {
        type: "single",
        question: "Which is better?",
        options: [
          `Ask me anything you need.`,
          `Proceed with clearly marked assumptions. Only ask me if the missing information blocks the task.`,
        ],
        correct: 1,
        explanation: "Mark assumptions and proceed. Save questions for true blockers.",
      },
    },
    // Workflow-structure issues (the add-on)
    {
      id: "jumps",
      title: "Claude jumps straight to a final answer",
      experience: "You wanted analysis; Claude wrote the deliverable.",
      why: "You asked for an outcome but did not require Claude to understand, plan, and verify first.",
      fix: ["Use a phase-based prompt.", "Ask for PLAN.md before the final output."],
      bad: `Just give me the final version.`,
      better: `Before producing the final output, write a short PLAN.md with objective, known context, assumptions, proposed approach, risks, and what you will not do. Wait for me to approve the plan.`,
    },
    {
      id: "lose-track",
      title: "Claude loses track of multi-step work",
      experience: "A long task drifts. Earlier rules get dropped.",
      why: "No external task tracker, or the conversation became too long.",
      fix: ["Create a TODO.md and keep it updated."],
      bad: `Keep going.`,
      better: `Maintain a TODO.md. At the end of each phase, update it: what is done, what is in progress, what is blocked, what needs human review. Restate the rules at the top.`,
    },
    {
      id: "drift",
      title: "Different people prompt Claude differently",
      experience: "Two teammates get different answers for the same task.",
      why: "No shared prompt library, Project context, or Skill.",
      fix: ["Create Prompt Cards.", "Convert repeated workflows into shared Projects or Skills."],
      bad: `Everyone writes their own prompt.`,
      better: `Use the shared Prompt Card. If you improve it, propose the change back to the team library.`,
    },
    {
      id: "no-terms",
      title: "Claude does not know local terms",
      experience: "Claude guesses meaning of internal abbreviations.",
      why: "Internal terminology is not provided.",
      fix: ["Create a CONTEXT.md with glossary, boundaries, and verification expectations."],
      bad: `(no glossary)`,
      better: `Use this CONTEXT.md as the briefing. If a term is missing, mark it under "Terms to confirm" instead of guessing.`,
    },
    {
      id: "early-change",
      title: "Claude makes changes before you're ready",
      experience: "Files modified before you approved the plan.",
      why: "The prompt did not set permission boundaries.",
      fix: ["Ask for PLAN.md first.", "Include explicit no-edit boundary until you confirm."],
      bad: `Fix it.`,
      better: `Do not edit, finalize, approve, or change files until I confirm. First produce a PLAN.md.`,
    },
  ];

  // ---------- Workflow Templates (tabs) ----------
  // Every `.template` below is written as if it were a real .md file in a fictional
  // PGS project: "sample-game / v4 paytable handoff". The set is meant to be read together -
  // PROMPT_CARD wraps the prompt, TODO tracks the work, PLAN comes before changes,
  // CHECKLIST is the repeatable review pattern, CONTEXT bridges terminology,
  // SKILL_SEED packages it for reuse.
  const TEMPLATES = [
    {
      id: "phase",
      name: "Phase prompt",
      what: "Splits Claude work into clear stages - Understand → Plan → Draft → Review - so Claude can't jump straight to a final answer.",
      when: "Any task where the cost of a wrong answer is higher than the cost of a small delay. Especially: reviews, handoffs, anything that touches config or code.",
      why: "Lets a human supervise each stage and correct course early. Stops Claude from rewriting before you've agreed on the approach.",
      template: `We will review the v4 paytable handoff from the Math team in phases. Stop after each phase and wait for me to say "go."

Phase 1 - Understand
- Read the handoff note below.
- Summarize what was sent in plain English.
- Extract specific values, version numbers, and dates.
- List what is missing (e.g. is there a diff vs v3? is the side-bet pool addressed?).

Phase 2 - Plan
- Propose what should be checked before QA regression starts.
- List risks given the Friday release target.
- Tell me what needs human review (Math, QA, PM).

Phase 3 - Draft (only after I confirm the plan)
- Produce: questions for Math, test adjustments for QA, items for PM sign-off.

Phase 4 - Review
- Check the draft against CHECKLIST.md.
- Mark items where you were uncertain.

Important rules:
- Claude drafts. The Math lead decides on values.
- Do not approve any paytable change.
- Mark assumptions clearly.

Handoff note:
"""
The v4 paytable was regenerated after this week's RTP adjustment. The pool file for the side-bet was also rebuilt. Simulator output for the base game compares cleanly against the expected RTP. Side-bet has not been re-simulated yet. Target release: Friday.
"""`,
    },

    {
      id: "todo",
      name: "TODO.md",
      what: "A markdown task tracker that keeps Claude and humans aligned on what's done, blocked, or needs review across multiple Claude sessions.",
      when: "Tasks with more than three steps, multiple reviewers, or that may continue in another chat. Especially: cross-team handoffs.",
      why: "Persistent reference both humans and Claude can inspect, edit, and share. Stops you from re-explaining context every session.",
      template: `# TODO - v4 paytable handoff review

## Goal
Understand the v4 paytable handoff from Math and prepare the question lists QA + PM need answered before Friday's release.

## Context
- Game: sample-game
- Handoff received: Tuesday afternoon, from @math-lead
- Target release: Friday this week
- Prior version: v3 (currently in staging)
- Side-bet pool file was also regenerated - not addressed in the handoff note

## Claude's role
Acts as: cross-team explainer and question generator.

Claude must not:
- Approve the new paytable values
- Decide whether the release can proceed
- Treat side-bet behavior as unchanged without confirmation
- Make assumptions about Math-side decisions without flagging them

## Inputs
- v4_paytable_handoff.md (Math team's note)
- v3 → v4 numeric diff (manual, to be produced)
- staging_config.json (current v3 in staging)

## Acceptance criteria
- All numeric changes between v3 and v4 are listed
- Each change has either a stated reason or a question for Math
- Side-bet pool change is explicitly addressed
- Questions for Math, QA, and PM are listed separately
- No value is marked "approved" by Claude

## Task checklist
- [x] Receive and sanitize handoff note
- [x] Phase 1 - Understand: ask Claude to summarize the handoff
- [x] Phase 2 - Plan: list what needs to be verified
- [ ] Phase 3 - Draft: produce question lists for Math, QA, PM
- [ ] Phase 4 - Review: cross-check questions against the v3 → v4 diff
- [ ] Send Math questions to @math-lead
- [ ] Send QA questions to @qa-lead
- [ ] Confirm Friday release readiness with @pm

## Open questions
- Did the side-bet pool regeneration change probability mass for any outcome?
- Is staging currently running v3 or has someone applied v4 already?
- Was the RTP adjustment a target change or a calculation fix?

## Human review required
- @math-lead reviews Math questions before sending
- @qa-lead signs off on test plan adjustments before regression starts
- @pm signs off on release-date implications

## Final output location
PGS Workshop Project → handoffs/v4-paytable-review/`,
    },

    {
      id: "plan",
      name: "PLAN.md",
      what: "A short plan Claude writes before editing anything or producing a final output.",
      when: "Complex tasks - anything touching code, configs, or cross-team work. Always before the first \`Draft\` phase.",
      why: "Prevents Claude from moving too fast. Lets you correct the approach while it's still cheap.",
      template: `# PLAN - v4 paytable handoff review

## Objective
Produce a clear, owner-reviewable summary of what changed in the v4 paytable, with explicit questions for Math and QA before regression starts.

## Known context
- Math handed off v4 on Tuesday
- Game: sample-game; current production: v3
- Target release: Friday
- QA has not yet started regression
- Side-bet pool was regenerated but is not addressed in the handoff note

## Assumptions
- The v3 baseline currently in staging is correct
- The v4 handoff note is the authoritative description of what changed in the base game
- No other config has been changed in parallel by other teams
- "Side-bet not re-simulated yet" means side-bet RTP is unknown, not zero

## Proposed approach
1. Summarize the v4 handoff in plain English
2. Produce a v3 → v4 numeric diff (manual)
3. Group changes by area: base RTP, side-bet pool, feature flags
4. For each change: extract value, note stated reason, generate a question for Math
5. Produce a separate test-adjustment list for QA
6. Produce a release-readiness summary for PM

## Risks
- The handoff note may be incomplete - silent changes are possible
- Side-bet pool change could affect compliance-relevant RTP without being flagged
- Friday release date is tight if Math needs to clarify multiple items

## What I will not do
- Approve the v4 paytable
- Decide whether to proceed with Friday release
- Make assumptions about side-bet pool behavior without confirming with Math
- Modify staging_config.json or any other file

## Verification method
- @math-lead confirms the question list captures the real changes
- @qa-lead signs off on test adjustments before regression starts
- @pm signs off on release-date implications

## Human approval needed before
- Sending question lists to Math or QA
- Marking any v4 value as "confirmed"
- Communicating release-date implications to PM`,
    },

    {
      id: "checklist",
      name: "CHECKLIST.md",
      what: "A reusable checklist that turns department review knowledge into a visible, repeatable pattern.",
      when: "Any review you do more than once - QA passes, handoff reviews, pre-meeting prep, release readiness.",
      why: "Claude is more trustworthy when it checks against visible criteria instead of improvising. Also: makes implicit knowledge teachable.",
      template: `# CHECKLIST - Paytable handoff review

## Use this checklist when
You receive a paytable change from Math and need to prepare it for downstream review (QA, Dev, PM) before regression begins.

## Inputs required
- The handoff note from Math
- The prior version config (or staging snapshot)
- Game ID and target release date

## Review checks
- [ ] Game ID and version number are stated explicitly
- [ ] Every numeric change has a stated reason
- [ ] The diff between prior and new version is complete (not just highlights)
- [ ] Side-bet pool / feature flags are addressed (not just base game)
- [ ] Each change has a question for the responsible Math team member
- [ ] Test adjustments are listed separately for QA
- [ ] Release-readiness implications are summarized for PM
- [ ] Items requiring Math sign-off are flagged
- [ ] No value is marked "approved" by Claude

## Stop conditions
Stop and ask for human review if:
- The handoff is missing the diff or prior version reference
- Any change touches RTP or compliance-relevant fields
- The release date appears at risk
- The prompt asks Claude to "decide" or "approve"
- Required input is missing or contains real customer / operator data

## Output format
1. Summary (one paragraph)
2. Changes by area: base RTP, side-bet pool, feature flags
3. Questions for Math (numbered)
4. Test adjustments for QA (numbered)
5. Items for PM sign-off
6. Suggested next steps`,
    },

    {
      id: "context",
      name: "CONTEXT.md",
      what: "A briefing file that gives Claude department-local glossary, audience, and boundaries.",
      when: "Anywhere department terminology might trip Claude up - the first time you start a workflow Claude doesn't have prior context for.",
      why: "Compact briefing prevents Claude from guessing internal meaning of terms like 'pool', 'ticket tag', 'regression'.",
      template: `# CONTEXT - Paytable handoff review at PGS

## Audience
The output will be read by:
- Dev - preparing config changes for staging
- QA - planning regression
- PM - deciding release readiness
- Math - confirming interpretations of their handoff

## Purpose
This context helps Claude:
- Translate Math team handoffs into questions and test items
- Surface ambiguity instead of guessing
- Stay within "prep aid" boundaries - never decide or approve

## Terms and glossary
- **Paytable**: the numeric table mapping game outcomes to payout values
- **RTP**: return to player; the target average payout percentage
- **Side-bet**: an optional secondary wager evaluated alongside the base game
- **Pool / pool file**: the underlying file controlling reel population or outcome probability for one bet type
- **Ticket tag**: internal version label applied to a config bundle (e.g. \`base_v3\`)
- **Regression**: QA's standard re-validation run after any config change
- **Simulator output**: the result of running the math model against the paytable

## Department boundaries
Claude may help with:
- Summarizing handoff notes
- Producing diffs between versions
- Generating questions for Math, QA, and PM
- Drafting test-adjustment lists

Claude must not:
- Approve any paytable value
- Decide release readiness
- Override Math's interpretation of a change
- Treat a handoff value as "confirmed" without owner sign-off

## Common inputs
- Handoff notes (markdown or plain text from Math)
- JSON config files
- Prior version snapshots

## Preferred output style
- Numbered lists for questions
- A short summary paragraph at the top
- Items requiring sign-off in a separately-labeled section
- Plain language - no Math-internal shorthand unless defined in this file

## Verification expectations
Before using Claude's output:
- @math-lead reviews questions and any value interpretations
- @qa-lead signs off on test adjustments
- @pm signs off on any release-readiness implications`,
    },

    {
      id: "prompt-card",
      name: "PROMPT_CARD.md",
      what: "A shareable card describing one reusable prompt - what it does, when to use it, what to expect, when to graduate it to a Skill.",
      when: "Whenever a prompt has earned its keep - used at least twice and the output was actually useful.",
      why: "Other people should not have to reinvent good prompts in private chats. Cards are the bridge between one-off prompts and Skills.",
      template: `# Prompt Card - Cross-team handoff explainer

## Use when
You receive a file, note, or change from another department (Math, V2, iGaming, QA, Dev) and need to quickly understand it before discussing with the owner.

## Paste this into Claude
\`\`\`text
I received this file or note from another department. Explain it to me as someone who is technical but not familiar with this specific workflow.

Return:
1. What it appears to be
2. Why it might matter
3. Terms I should understand
4. Questions I should ask the owner
5. What I should not assume

Do not make approval decisions.

File / note:
"""
[paste the file or note here]
"""
\`\`\`

## Required inputs
- The file or note you received
- (Optional) Glossary of terms specific to your domain

## Output you should expect
- Plain-English summary
- Important terms to confirm
- Questions to ask the owner
- What not to assume

## Human review required for
- Any technical accuracy claims in the summary
- Any value or decision suggested

## When to turn this into a Skill
This card has been used by Dev and QA at least 5 times for handoff reviews - it's a candidate for a "Cross-Department Explainer" Skill. See SKILL_SEED.md.`,
    },

    {
      id: "skill-seed",
      name: "SKILL_SEED.md",
      what: "Instructions Claude can use to behave consistently for a repeating workflow - the seed of a future Skill.",
      when: "After a Prompt Card has been used more than three times and the team agrees the workflow is worth packaging.",
      why: "Skills make a vetted workflow available consistently. Where company settings allow it, they can be shared across the team.",
      template: `# Skill seed - Cross-Department Handoff Explainer

## Use this skill when
You receive a file or note from another PGS department (Math, V2, iGaming, QA, Dev) and need to prepare for a review conversation with the owner.

## Claude should
- Summarize the handoff in plain English
- Extract specific values, terms, and version references from the input
- Generate questions grouped by department (Math, QA, PM)
- Flag items requiring human sign-off
- Mark unclear terms under "Terms to confirm" instead of guessing
- Address side-bet / pool changes explicitly, not just base-game RTP

## Claude must not
- Approve the handoff
- Decide release readiness
- Treat values as confirmed without owner sign-off
- Use Math, QA, or department-internal shorthand without defining it
- Modify any files

## Output format
1. Summary
2. Important details (values, versions, dates)
3. Assumptions (clearly labeled)
4. Questions for the owner (grouped by department)
5. Items requiring human owner review
6. Terms to confirm

## Reference files
- CONTEXT.md - glossary and boundaries
- CHECKLIST.md - review criteria
- PROMPT_CARD.md - the prompt that became this Skill

## Maturity
- Used 6+ times by Dev and QA on real handoffs
- Promoted to Skill after a 2-week pilot
- Eligible for team-wide provisioning where company settings allow`,
    },
  ];

  // ---------- Example Library ----------
  const EXAMPLES = [
    {
      id: "ex1",
      title: "Messy notes to action checklist",
      input: `Game config changed for next release. Need confirm values. Dev said old config may still be used in QA. Math wants to check numbers before final. QA asked if this affects regression. Need follow-up.`,
      prompt: `Turn these rough notes into:
1. Decisions made
2. Open questions
3. Risks
4. Owners needed
5. Follow-up checklist

Do not invent missing details. Mark missing owners as "Owner needed."`,
    },
    {
      id: "ex2",
      title: "Cross-team explanation",
      input: `The pool file was regenerated after the latest paytable adjustment. Simulator output needs to be compared against the expected RTP before downstream validation continues.`,
      prompt: `Explain this to someone from another department who is technical but not familiar with this workflow.

Return:
1. Plain-English explanation
2. Important terms
3. Why it matters
4. Questions to ask the owner
5. What not to assume`,
    },
    {
      id: "ex3",
      title: "JSON config review",
      input: `{
  "gameId": "sample-game",
  "rtp": 95.0,
  "poolType": "standard",
  "ticketTag": "base_v3",
  "featureEnabled": true
}`,
      prompt: `Review this sample JSON config as a preparation aid.

Return:
1. Fields present
2. Values that need owner confirmation
3. Possible risks or unclear items
4. Questions to ask before using this config

Do not say it is approved.`,
    },
    {
      id: "ex4",
      title: "Bad Claude answer diagnosis",
      input: `Everything looks correct. The RTP is fine and this should be approved.`,
      prompt: `Diagnose this output:
- Too confident
- No evidence
- No source values extracted
- No assumptions listed
- No human owner review
- Makes an approval decision

Better instruction:
"Do not approve this. Extract the values provided, list assumptions, identify unknowns, and give questions for the responsible owner."`,
    },
    {
      id: "ex5",
      title: "Safe Claude Code prompt",
      input: `(short, scoped, testable)`,
      prompt: `Write a small Python script that parses a simple pasted text report and extracts:
- total spins
- total win
- bet amount
- calculated RTP

Include:
1. Assumptions before coding
2. Sample input
3. Expected output
4. Unit tests
5. Error handling for missing fields

Do not connect to any database.
Do not modify files.
Do not claim the result is approved.`,
    },
    {
      id: "ex6",
      title: "Skill seed",
      input: `(template)`,
      prompt: `When I give Claude a note or file from another department, I want it to always explain it in plain language, list terms to confirm, and generate questions for the owner, and never approve the work or pretend it knows missing internal context.`,
    },
  ];

  // ---------- Troubleshooting Checklist ----------
  const TROUBLESHOOT = [
    "Did I provide enough context?",
    "Did I define the audience?",
    "Did I define the goal?",
    "Did I specify the output format?",
    "Did I include examples?",
    "Did I ask it to separate facts from assumptions?",
    "Did I define what needs human review?",
    "Did I make the task too large?",
    "Did I provide department terminology or a glossary?",
    "Did I specify how to handle missing information?",
    "For code, did I require tests and sample input/output?",
    "Did I verify the result with the right owner?",
  ];

  // Maturity ladder (Method 7)
  const MATURITY = [
    { lvl: "One-off question",            d: "Good for quick help." },
    { lvl: "Reusable prompt",             d: "Good when you repeat the same task." },
    { lvl: "Prompt card",                 d: "Good when other people should copy the pattern." },
    { lvl: "Shared Project",              d: "Good when the workflow needs files, examples, context, or department instructions." },
    { lvl: "Skill",                       d: "Good when the workflow should be triggered repeatedly and consistently." },
    { lvl: "Provisioned/team-shared",     d: "Good when the organization wants a vetted workflow broadly available." },
  ];

  // ---------- Playground presets ----------
  // Each preset is a complete prompt + sample input embedded - ready to Run.
  const PRESETS = [
    {
      id: "explainer",
      title: "Explain a file from another team",
      blurb: "Paste in a note from QA, Math, V2 - get a plain-English summary + questions for the owner.",
      prompt: `I received this note from another department. Explain it to me as someone who is technical but not familiar with this specific workflow.

Note:
"""
The pool file was regenerated after the latest paytable adjustment. Simulator output needs to be compared against the expected RTP before downstream validation continues.
"""

Return:
1. What it appears to be
2. Why it might matter
3. Terms I should understand
4. Questions I should ask the owner
5. What I should not assume

Do not make approval decisions.`,
    },
    {
      id: "messy-notes",
      title: "Messy meeting notes → action checklist",
      blurb: "Rough notes from a release sync, turned into decisions / risks / owners / follow-ups.",
      prompt: `Turn these rough notes into:
1. Decisions made
2. Open questions
3. Risks
4. Owners needed
5. Follow-up checklist

Do not invent missing details. Mark missing owners as "Owner needed."

Notes:
"""
Game config changed for next release. Need confirm values. Dev said old config may still be used in QA. Math wants to check numbers before final. QA asked if this affects regression. Need follow-up.
"""`,
    },
    {
      id: "config-review",
      title: "Review a JSON config (as a prep aid)",
      blurb: "Get a structured review with values that need owner confirmation. Does NOT approve.",
      prompt: `Review this sample JSON config as a preparation aid.

Config:
\`\`\`json
{
  "gameId": "sample-game",
  "rtp": 95.0,
  "poolType": "standard",
  "ticketTag": "base_v3",
  "featureEnabled": true
}
\`\`\`

Return:
1. Fields present
2. Values that need owner confirmation
3. Possible risks or unclear items
4. Questions to ask before using this config

Do not say it is approved.`,
    },
    {
      id: "facts-assumptions",
      title: "Force facts vs assumptions",
      blurb: "Make Claude split its answer so silent guesses become visible.",
      prompt: `Read the input below and respond in this structure:

1. Facts found directly in the input
2. Assumptions you are making
3. Unknowns or missing information
4. Questions for the owner
5. Suggested next steps

Do not present assumptions as facts.

Input:
"""
We rolled a hotfix for the side-bet calculator yesterday afternoon. The QA team flagged that one regression run was inconclusive but said it's probably fine. The release is planned for Friday.
"""`,
    },
    {
      id: "small-utility",
      title: "Small testable utility (Claude Code style)",
      blurb: "Tight scope, tests required, no production changes. The safe coding pattern.",
      prompt: `Create a small Python utility for this specific task only.

Goal:
Parse a simple text report and extract: total spins, total win, bet amount, calculated RTP.

Rules:
1. List your assumptions before writing code.
2. Include a sample input and expected output.
3. Write unit tests for valid input, missing fields, and invalid types.
4. Do not modify any files.
5. Do not connect to any database.
6. Explain how a human should verify the result.
7. Do not claim the result is approved.`,
    },
    {
      id: "phased",
      title: "Phase-based prompt",
      blurb: "Force Claude to slow down - Understand → Plan → Draft → Review.",
      prompt: `We will work in phases. Stop after each phase and wait for me to confirm.

Phase 1 - Understand
- Summarize the input below.
- List facts.
- List assumptions.
- Identify missing context.

Phase 2 - Plan (only after I say "go")
- Propose an approach.
- List risks.
- Tell me what needs human review.

Phase 3 - Draft (only after I approve the plan)
- Produce the deliverable.

Phase 4 - Review
- Check against acceptance criteria.
- Mark items needing human review.

Claude must not: approve anything, change files, or treat assumptions as facts.

Input:
"""
The math team handed off the v4 paytable. QA needs to run regression. PM wants to know if we can hit the Friday release. Dev is asking whether the side-bet flag should stay on for staging.
"""`,
    },
    {
      id: "freestyle",
      title: "Blank slate - write your own",
      blurb: "Start from nothing and try anything. Paste a real (sanitized) task.",
      prompt: ``,
    },
  ];

  // ---------- Pilot ideas (curated starter pilots - no form) ----------
  const PILOT_IDEAS = [
    {
      id: "p1",
      who: "Anyone with cross-team handoffs",
      title: "Translate a file from another department",
      why: "Stop spending 20 minutes deciphering a doc before you can even ask a smart question.",
      effort: "5 minutes",
      risk: "Low",
      prompt: `I received this file or note from another department. Explain it to me as someone who is technical but not familiar with this specific workflow.

Return:
1. What it appears to be
2. Why it might matter
3. Terms I should understand
4. Questions I should ask the owner
5. What I should not assume

Do not make approval decisions.`,
    },
    {
      id: "p2",
      who: "QA, PM, anyone in review meetings",
      title: "Messy notes → decisions, risks, owners",
      why: "Turn a chaotic Slack thread or whiteboard photo into a structured follow-up you can actually act on.",
      effort: "5 minutes",
      risk: "Low",
      prompt: `Turn these rough notes into:
1. Decisions made
2. Open questions
3. Risks
4. Owners needed
5. Follow-up checklist

Do not invent missing details. Mark missing owners as "Owner needed."`,
    },
    {
      id: "p3",
      who: "Dev, QA, Math",
      title: "Pre-review a config / spec change",
      why: "Get an unbiased second pair of eyes before you sign off - without Claude pretending it can sign off.",
      effort: "10 minutes",
      risk: "Low (Claude prepares; you decide)",
      prompt: `Review this file as a preparation aid for the owner review.

Return:
1. Fields / sections present
2. Values that need owner confirmation
3. Possible risks or unclear items
4. Questions to ask the owner

Do not say it is approved. Do not make a release decision.`,
    },
    {
      id: "p4",
      who: "Anyone reading a Claude answer",
      title: "Force facts vs assumptions",
      why: "Stop confident-sounding answers from sneaking through. Make Claude show its work.",
      effort: "2 minutes",
      risk: "Low",
      prompt: `Before giving suggestions, separate your response into:

1. Facts found directly in the input
2. Assumptions you are making
3. Unknowns or missing information
4. Questions for the owner
5. Suggested next steps

Do not present assumptions as facts.`,
    },
    {
      id: "p5",
      who: "Devs trying Claude Code",
      title: "Tiny testable utility",
      why: "The safe way to start with Claude Code: one scoped task, tests required, no production changes.",
      effort: "20 minutes",
      risk: "Low (sandboxed)",
      prompt: `Create a small utility for this specific task only.

Goal:
[Describe the task in one sentence.]

Inputs:
[Describe sample input.]

Expected output:
[Describe output.]

Rules:
1. List assumptions before coding.
2. Write unit tests.
3. Include sample input and expected output.
4. Do not modify existing production files.
5. Explain how to verify the result.`,
    },
    {
      id: "p6",
      who: "Anyone repeating a task",
      title: "Capture your first Skill seed",
      why: "If you do something twice and it works, write the seed. If it works a third time, propose the Skill to your team.",
      effort: "3 minutes",
      risk: "None - it's just a markdown file",
      prompt: `When I give Claude [input], I want it to always [behavior], and never [risk].

Example:
When I give Claude a note from another department, I want it to always explain it in plain language and list questions for the owner, and never approve the file or pretend it knows internal context that was not provided.`,
    },
  ];

  return {
    SECTIONS, EXAMPLE_PROJECT,
    TOOLBOX_HELPS, TOOLBOX_AVOID,
    BAD_PROMPT_S5, BAD_PROMPT_S5_WHY, BETTER_PROMPT_S5,
    EXPLAINER_PROMPT, EXPLAINER_EXAMPLE_INPUT, EXPLAINER_EXAMPLE_OUTPUT,
    TRUST_CHECKLIST, TRUST_BAD_OUTPUT, TRUST_BAD_REASONS, TRUST_SAFER_OUTPUT,
    CODE_BAD, CODE_BETTER, CODE_VALIDATOR_EXAMPLE,
    SKILL_EXAMPLES, SKILL_TEMPLATE,
    ISSUES, TEMPLATES, EXAMPLES, TROUBLESHOOT, MATURITY,
    PRESETS, PILOT_IDEAS,
  };
})();
