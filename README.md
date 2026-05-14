# PGS Claude Practice Lab

A hands-on Claude adoption workshop, packaged as a self-contained web app. Built for an internal 60-minute meeting at Pong Game Studios — attendees scan a QR, run real prompts on their phones, and leave with one safe pilot they can actually use.

> **Claude drafts. Owners decide.**
>
> Claude can prepare, compare, summarize, explain, draft, test, and organize.
> It should not approve math, compliance, production releases, or department decisions.

## What's in here

- **Attendee mode** (`#a/...`) — mobile-first playground. Browse around, copy prompts, run them live against Claude via `window.claude.complete()`, take the templates home.
- **Presenter mode** (`#p/...`) — projection-friendly. Large display type, per-section timer, facilitator notes, keyboard arrow navigation.
- **15+ sections**, including a Common Issues Lab, a real-time Playground with seven presets, an example library with Run buttons, and seven filled-in markdown templates from a coherent fictional scenario.

## Quick start (local)

No build step. Just serve the directory.

```bash
git clone https://github.com/<you>/pgs-claude-practice-lab.git
cd pgs-claude-practice-lab
python3 -m http.server 8000
# open http://localhost:8000
```

Or any static server (`npx serve`, `caddy file-server`, etc.).

> Note: `window.claude.complete()` is provided by the Claude artifact host. When running locally outside that host, the Playground's "Run with Claude" button will error. Everything else (copy buttons, templates, navigation) works offline.

## Deploy to GitHub Pages

1. **Create the repo** (you do this — the tooling here is read-only on GitHub):

   ```bash
   gh repo create pgs-claude-practice-lab --public --source=. --remote=origin
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Enable Pages**: Repo → Settings → Pages → Source: `Deploy from a branch` → Branch: `main`, folder `/ (root)` → Save.

3. **Wait ~1 min**. GitHub will publish at `https://<you>.github.io/pgs-claude-practice-lab/`.

4. **The QR auto-points there.** The Welcome screen's QR code reads `window.location.href` — wherever you host this, the QR sends scanners back to the same page. No hardcoded URL anywhere.

## Project structure

```
index.html              # entry point (loads everything below)
styles.css              # design tokens + base styles
src/
  content.js            # all workshop content as data (sections, prompts, examples, .md templates)
  ui.jsx                # shared primitives (CopyButton, ClaudeRunner, QR, AppState…)
  sections.jsx          # attendee section views 01-10
  builder.jsx           # templates, issues, library, playground, take-home, closing
  presenter.jsx         # presenter-mode views + slide shell
  app.jsx               # routing + mode shell + mount
```

JSX is compiled in the browser via Babel Standalone. This is fine for a workshop tool (small audience, infrequent loads). If you want to precompile for faster first paint, run any JSX tool over `src/*.jsx` and update the script tags in `index.html`.

## Editing content

All workshop content lives in `src/content.js` as a single `window.PGS` object. Edit the strings in place — no rebuild needed.

- **Sections / agenda**: `SECTIONS`
- **Example .md files** (the seven templates): `TEMPLATES` — every `template` field is a filled-in markdown file from the example scenario
- **Common issues**: `ISSUES`
- **Library examples**: `EXAMPLES`
- **Playground presets**: `PRESETS`
- **Pilot ideas** (the take-home gallery): `PILOT_IDEAS`
- **Facilitator notes** (presenter mode): `FACILITATOR`

## License

MIT. See `LICENSE`.

## Credits

Built for Pong Game Studios' internal Claude adoption workshop.
QR encoding via [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator).
