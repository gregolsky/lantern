import { describe, it, expect } from "vitest";
import { buildControlsCsv } from "../utils/exportCsv";
import type { Control, UserControlState } from "../types";

const controlA: Control = {
  id: "AC-AUTH",
  title: "Authentication Controls",
  domain: "Access Control",
  description: "Covers all auth methods",
  frameworks: {
    ISO27001: { refs: ["A.8.5"], summary: "Secure authentication", citation: "https://example.com/iso" },
    NIS2: { refs: ["Art.21(2)(j)"], summary: "MFA required", threshold: "All privileged accounts" },
  },
};

const controlB: Control = {
  id: "AC-PRIV",
  title: "Privileged Access",
  domain: "Access Control",
  parentId: "AC-AUTH",
  frameworks: {
    ISO27001: { refs: ["A.8.2", "A.8.3"], summary: "Least privilege" },
  },
};

const controlC: Control = {
  id: "BC-PLAN",
  title: "Business Continuity",
  domain: "Continuity",
  frameworks: {
    HIPAA: { refs: ["§164.308(a)(7)"], summary: "Contingency plan" },
  },
};

function parseRows(csv: string): string[][] {
  // Split on CRLF row boundaries (not on newlines inside quoted fields)
  const rows: string[][] = [];
  for (const line of csv.split("\r\n")) {
    const fields: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuote = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') { inQuote = true; }
        else if (ch === ',') { fields.push(cur); cur = ""; }
        else { cur += ch; }
      }
    }
    fields.push(cur);
    rows.push(fields);
  }
  return rows;
}

describe("buildControlsCsv — wide format", () => {
  it("emits header with fixed columns then per-framework column groups", () => {
    const csv = buildControlsCsv([], {}, {}, ["ISO27001", "NIS2"]);
    const [header] = parseRows(csv);
    expect(header.slice(0, 8)).toEqual([
      "Control ID", "Title", "Domain", "Parent ID", "Description",
      "Done", "Updated At", "Notes",
    ]);
    expect(header).toContain("ISO27001 Refs");
    expect(header).toContain("ISO27001 Summary");
    expect(header).toContain("NIS2 Refs");
    expect(header).toContain("NIS2 Threshold");
  });

  it("includes only columns for selectedFrameworks", () => {
    const csv = buildControlsCsv([], {}, {}, ["ISO27001"]);
    const [header] = parseRows(csv);
    expect(header.some((h) => h.startsWith("NIS2"))).toBe(false);
    expect(header.some((h) => h.startsWith("ISO27001"))).toBe(true);
  });

  it("orders framework columns in FRAMEWORK_ORDER regardless of selectedFrameworks order", () => {
    const csv = buildControlsCsv([], {}, {}, ["NIS2", "ISO27001"]);
    const [header] = parseRows(csv);
    const isoIdx = header.indexOf("ISO27001 Refs");
    const nis2Idx = header.indexOf("NIS2 Refs");
    expect(isoIdx).toBeLessThan(nis2Idx);
  });

  it("produces one row per control (not per framework)", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001", "NIS2"]);
    const rows = parseRows(csv);
    expect(rows).toHaveLength(2); // header + 1 row
  });

  it("skips controls that map to none of the selected frameworks", () => {
    const csv = buildControlsCsv([controlA, controlC], {}, {}, ["ISO27001"]);
    const rows = parseRows(csv);
    expect(rows).toHaveLength(2); // header + controlA only
    expect(rows[1][0]).toBe("AC-AUTH");
  });

  it("fills framework columns with the mapping values when present", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001", "NIS2"]);
    const [header, row] = parseRows(csv);
    const isoRefsIdx = header.indexOf("ISO27001 Refs");
    const isoSumIdx = header.indexOf("ISO27001 Summary");
    const isoCitIdx = header.indexOf("ISO27001 Citation");
    const nis2ThrIdx = header.indexOf("NIS2 Threshold");
    expect(row[isoRefsIdx]).toBe("A.8.5");
    expect(row[isoSumIdx]).toBe("Secure authentication");
    expect(row[isoCitIdx]).toBe("https://example.com/iso");
    expect(row[nis2ThrIdx]).toBe("All privileged accounts");
  });

  it("leaves framework columns empty when the control has no mapping for that framework", () => {
    const csv = buildControlsCsv([controlB], {}, {}, ["ISO27001", "NIS2"]);
    const [header, row] = parseRows(csv);
    const nis2RefsIdx = header.indexOf("NIS2 Refs");
    expect(row[nis2RefsIdx]).toBe("");
  });

  it("joins multiple refs with semicolons", () => {
    const csv = buildControlsCsv([controlB], {}, {}, ["ISO27001"]);
    const [header, row] = parseRows(csv);
    expect(row[header.indexOf("ISO27001 Refs")]).toBe("A.8.2;A.8.3");
  });

  it("populates parentId when set, empty string otherwise", () => {
    const csv = buildControlsCsv([controlA, controlB], {}, {}, ["ISO27001"]);
    const [header, rowA, rowB] = parseRows(csv);
    const parentIdx = header.indexOf("Parent ID");
    expect(rowA[parentIdx]).toBe("");
    expect(rowB[parentIdx]).toBe("AC-AUTH");
  });

  it("reflects user check state (done=yes, updatedAt)", () => {
    const checks: Record<string, UserControlState> = {
      "AC-AUTH": { done: true, updatedAt: "2025-06-01T10:00:00.000Z" },
    };
    const csv = buildControlsCsv([controlA], checks, {}, ["ISO27001"]);
    const [header, row] = parseRows(csv);
    expect(row[header.indexOf("Done")]).toBe("yes");
    expect(row[header.indexOf("Updated At")]).toBe("2025-06-01T10:00:00.000Z");
  });

  it("marks unchecked controls as done=no with empty updatedAt", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001"]);
    const [header, row] = parseRows(csv);
    expect(row[header.indexOf("Done")]).toBe("no");
    expect(row[header.indexOf("Updated At")]).toBe("");
  });

  it("reflects user notes", () => {
    const notes = { "AC-AUTH": "Reviewed with auditor" };
    const csv = buildControlsCsv([controlA], {}, notes, ["ISO27001"]);
    const [header, row] = parseRows(csv);
    expect(row[header.indexOf("Notes")]).toBe("Reviewed with auditor");
  });

  it("returns only the header row for an empty controls array", () => {
    const csv = buildControlsCsv([], {}, {}, ["ISO27001"]);
    expect(csv.split("\r\n")).toHaveLength(1);
  });

  it("returns only the header row when selectedFrameworks is empty", () => {
    const csv = buildControlsCsv([controlA], {}, {}, []);
    expect(csv.split("\r\n")).toHaveLength(1);
  });

  describe("RFC 4180 quoting", () => {
    it("quotes fields containing commas", () => {
      const c: Control = { id: "X", title: "One, Two", domain: "D", frameworks: { ISO27001: { refs: ["A.1"] } } };
      expect(buildControlsCsv([c], {}, {}, ["ISO27001"])).toContain('"One, Two"');
    });

    it("escapes embedded double quotes", () => {
      const c: Control = { id: "X", title: 'Say "hello"', domain: "D", frameworks: { ISO27001: { refs: ["A.1"] } } };
      expect(buildControlsCsv([c], {}, {}, ["ISO27001"])).toContain('"Say ""hello"""');
    });

    it("quotes notes containing newlines so they remain one cell", () => {
      const c: Control = { id: "X", title: "T", domain: "D", frameworks: { ISO27001: { refs: ["A.1"] } } };
      expect(buildControlsCsv([c], {}, { X: "line one\nline two" }, ["ISO27001"])).toContain('"line one\nline two"');
    });
  });
});
