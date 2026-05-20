# Lantern — Feature Ideas

## Quick wins (low effort)

- **Control search / filter bar** — text search across control IDs and titles; currently the only way to find a control is to scroll
- **Status labels beyond checked** — e.g. "In Progress", "Not Applicable", "Needs Review" instead of a binary checkbox
- **Keyboard shortcuts** — `n` to open notes, `/` to focus search, arrow keys to navigate controls
- **Print / PDF export** — styled print view with your org name, date, and framework scores

## Medium features

- **Audit log** — timestamped changelog of who checked/unchecked what (stored locally); useful for auditors asking "when did you implement this?"
- **Due dates on controls** — attach a target date; show an "overdue" badge and a timeline view
- **Evidence attachments** — link a URL or paste a snippet as evidence per control (stored in localStorage alongside notes)
- **Multiple profiles / workspaces** — track two separate orgs or environments (prod vs staging) side by side
- **Gap analysis report** — one-click summary listing all unchecked controls grouped by framework, exported as Markdown or CSV

## Bigger features

- **Cross-framework overlap map** — visualize which single control satisfies requirements across multiple frameworks simultaneously (e.g. access control hits ISO + SOC 2 + HIPAA)
- **Shareable snapshots** — encode state in a compressed URL param so you can share a read-only view without a backend
- **Remediation task board** — Kanban-style view (Backlog / In Progress / Done) driven by the compliance status of controls
- **Custom framework** — let users define their own framework (name + list of controls) and track it alongside the built-ins
