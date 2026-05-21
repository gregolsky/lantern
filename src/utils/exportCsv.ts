import type { Control, FrameworkId, UserControlState } from "../types";
import { FRAMEWORK_ORDER } from "../data/frameworks";

export function buildControlsCsv(
  controls: Control[],
  checks: Record<string, UserControlState>,
  notes: Record<string, string>,
  selectedFrameworks: FrameworkId[],
): string {
  const header = [
    "Control ID", "Title", "Domain", "Parent ID",
    "Framework", "Refs", "Summary", "Threshold", "Citation",
    "Done", "Updated At", "Notes", "Description",
  ];
  const rows: string[][] = [header];

  for (const c of controls) {
    for (const fwId of FRAMEWORK_ORDER) {
      if (!selectedFrameworks.includes(fwId)) continue;
      const m = c.frameworks[fwId];
      if (!m) continue;
      const state = checks[c.id];
      rows.push([
        c.id, c.title, c.domain, c.parentId ?? "",
        fwId, m.refs.join(";"), m.summary ?? "", m.threshold ?? "", m.citation ?? "",
        state?.done ? "yes" : "no",
        state?.updatedAt ?? "",
        notes[c.id] ?? "",
        c.description ?? "",
      ]);
    }
  }
  return rows.map(r => r.map(csvField).join(",")).join("\r\n");
}

function csvField(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
