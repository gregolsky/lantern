import type { Control, FrameworkId, UserControlState } from "../types";
import { FRAMEWORK_ORDER } from "../data/frameworks";

// Wide format: one row per control, with per-framework columns side by side.
// Framework columns only appear for the user's selectedFrameworks (in FRAMEWORK_ORDER).
export function buildControlsCsv(
  controls: Control[],
  checks: Record<string, UserControlState>,
  notes: Record<string, string>,
  selectedFrameworks: FrameworkId[],
): string {
  const activeFws = FRAMEWORK_ORDER.filter((f) => selectedFrameworks.includes(f));

  const header = [
    "Control ID", "Title", "Domain", "Parent ID", "Description",
    "Done", "Updated At", "Notes",
    ...activeFws.flatMap((f) => [`${f} Refs`, `${f} Summary`, `${f} Threshold`, `${f} Citation`]),
  ];
  const rows: string[][] = [header];

  for (const c of controls) {
    const hasAny = activeFws.some((f) => !!c.frameworks[f]);
    if (!hasAny) continue;
    const state = checks[c.id];
    const fwCols = activeFws.flatMap((f) => {
      const m = c.frameworks[f];
      return m
        ? [m.refs.join(";"), m.summary ?? "", m.threshold ?? "", m.citation ?? ""]
        : ["", "", "", ""];
    });
    rows.push([
      c.id, c.title, c.domain, c.parentId ?? "", c.description ?? "",
      state?.done ? "yes" : "no",
      state?.updatedAt ?? "",
      notes[c.id] ?? "",
      ...fwCols,
    ]);
  }
  return rows.map(r => r.map(csvField).join(",")).join("\r\n");
}

function csvField(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
