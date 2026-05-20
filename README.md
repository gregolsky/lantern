# 🪔 Lantern

Multi-framework compliance tracker — a client-side PWA that lets you track your organisation's progress across five major security and privacy frameworks simultaneously.

**Live demo:** https://gregolsky.github.io/lantern/

## Frameworks

| Framework | Coverage |
|-----------|----------|
| ISO 27001:2022 | All 93 Annex A controls (A.5–A.8) |
| SOC 2 (TSC 2017/2022) | All 61 Trust Services Criteria (CC, A, C, PI, P) |
| NIS2 Directive | Articles 21 & 23 — 18 controls |
| GDPR | Articles 5–7, 9, 12–18, 20–22, 24–26, 28, 30, 32–35, 37–39, 44–46 — 29 controls |
| HIPAA Security Rule | §164.308–316 — 64 controls |

## Features

- **Multi-framework view** — toggle one or more frameworks; controls that span multiple are shown once with all relevant tags
- **List / Matrix / Charts** views
- **Per-control notes** — rich-text notes saved locally in the browser
- **Progress bars** — per-framework completion at a glance
- **Export / Import** — JSON snapshot of all checks and notes; works offline
- **PWA** — installable, works fully offline after first load

## Development

```bash
npm install
npm run dev        # start dev server
npm test           # run tests (vitest)
npm run build      # production build → dist/
```

## Data & attribution

- **ISO 27001:2022** — control IDs and titles only; full standard © ISO, all rights reserved
- **SOC 2 TSC** — authored summaries of AICPA Trust Services Criteria; full criteria © AICPA
- **NIS2 & GDPR** — sourced from EUR-Lex (CC BY 4.0)
- **HIPAA Security Rule** — sourced from eCFR (public domain)

Progress and notes are stored in `localStorage` and never leave your device.
