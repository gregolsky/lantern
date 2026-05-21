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
  return csv.split("\r\n").map((line) =>
    line.split(",").map((f) => f.replace(/^"|"$/g, "").replace(/""/g, '"'))
  );
}

describe("buildControlsCsv", () => {
  it("emits header as the first row with 13 columns", () => {
    const csv = buildControlsCsv([], {}, {}, ["ISO27001"]);
    const [header] = parseRows(csv);
    expect(header).toEqual([
      "Control ID", "Title", "Domain", "Parent ID",
      "Framework", "Refs", "Summary", "Threshold", "Citation",
      "Done", "Updated At", "Notes", "Description",
    ]);
  });

  it("produces one row per control × selected framework mapping", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001", "NIS2"]);
    const rows = parseRows(csv);
    expect(rows).toHaveLength(3); // header + 2 framework rows
    expect(rows[1][0]).toBe("AC-AUTH");
    expect(rows[1][4]).toBe("ISO27001");
    expect(rows[2][4]).toBe("NIS2");
  });

  it("skips frameworks not in selectedFrameworks", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001"]);
    const rows = parseRows(csv);
    expect(rows).toHaveLength(2); // header + ISO27001 only
    expect(rows[1][4]).toBe("ISO27001");
  });

  it("skips controls that have no mapping for a selected framework", () => {
    const csv = buildControlsCsv([controlA, controlC], {}, {}, ["HIPAA"]);
    const rows = parseRows(csv);
    expect(rows).toHaveLength(2); // header + controlC only
    expect(rows[1][0]).toBe("BC-PLAN");
  });

  it("joins multiple refs with semicolons", () => {
    const csv = buildControlsCsv([controlB], {}, {}, ["ISO27001"]);
    const rows = parseRows(csv);
    expect(rows[1][5]).toBe("A.8.2;A.8.3");
  });

  it("populates parentId when set, empty string otherwise", () => {
    const csv = buildControlsCsv([controlA, controlB], {}, {}, ["ISO27001"]);
    const rows = parseRows(csv);
    const rowA = rows.find((r) => r[0] === "AC-AUTH")!;
    const rowB = rows.find((r) => r[0] === "AC-PRIV")!;
    expect(rowA[3]).toBe("");
    expect(rowB[3]).toBe("AC-AUTH");
  });

  it("reflects user check state in Done and Updated At columns", () => {
    const checks: Record<string, UserControlState> = {
      "AC-AUTH": { done: true, updatedAt: "2025-06-01T10:00:00.000Z" },
    };
    const csv = buildControlsCsv([controlA], checks, {}, ["ISO27001"]);
    const rows = parseRows(csv);
    expect(rows[1][9]).toBe("yes");
    expect(rows[1][10]).toBe("2025-06-01T10:00:00.000Z");
  });

  it("reflects user notes in Notes column", () => {
    const notes = { "AC-AUTH": "Reviewed with auditor" };
    const csv = buildControlsCsv([controlA], {}, notes, ["ISO27001"]);
    const rows = parseRows(csv);
    expect(rows[1][11]).toBe("Reviewed with auditor");
  });

  it("marks unchecked controls as done=no with empty updatedAt", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001"]);
    const rows = parseRows(csv);
    expect(rows[1][9]).toBe("no");
    expect(rows[1][10]).toBe("");
  });

  it("populates summary, threshold, and citation from FrameworkMapping", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["ISO27001", "NIS2"]);
    const rows = parseRows(csv);
    const isoRow = rows.find((r) => r[4] === "ISO27001")!;
    const nis2Row = rows.find((r) => r[4] === "NIS2")!;
    expect(isoRow[6]).toBe("Secure authentication");
    expect(isoRow[8]).toBe("https://example.com/iso");
    expect(nis2Row[7]).toBe("All privileged accounts");
  });

  it("follows FRAMEWORK_ORDER when emitting rows for a control", () => {
    const csv = buildControlsCsv([controlA], {}, {}, ["NIS2", "ISO27001"]);
    const dataRows = parseRows(csv).slice(1);
    // ISO27001 comes before NIS2 in FRAMEWORK_ORDER regardless of selectedFrameworks order
    expect(dataRows[0][4]).toBe("ISO27001");
    expect(dataRows[1][4]).toBe("NIS2");
  });

  describe("RFC 4180 quoting", () => {
    it("quotes fields that contain commas", () => {
      const control: Control = {
        id: "X", title: "One, Two", domain: "D", frameworks: { ISO27001: { refs: ["A.1"] } },
      };
      const csv = buildControlsCsv([control], {}, {}, ["ISO27001"]);
      expect(csv).toContain('"One, Two"');
    });

    it("quotes fields that contain double quotes and escapes them", () => {
      const control: Control = {
        id: "X", title: 'Say "hello"', domain: "D", frameworks: { ISO27001: { refs: ["A.1"] } },
      };
      const csv = buildControlsCsv([control], {}, {}, ["ISO27001"]);
      expect(csv).toContain('"Say ""hello"""');
    });

    it("quotes notes that contain newlines so they form a single cell", () => {
      const control: Control = {
        id: "X", title: "T", domain: "D", frameworks: { ISO27001: { refs: ["A.1"] } },
      };
      const notes = { X: "line one\nline two" };
      const csv = buildControlsCsv([control], {}, notes, ["ISO27001"]);
      expect(csv).toContain('"line one\nline two"');
    });
  });

  it("returns only the header row for an empty controls array", () => {
    const csv = buildControlsCsv([], {}, {}, ["ISO27001", "NIS2"]);
    expect(csv.split("\r\n")).toHaveLength(1);
  });

  it("returns only the header row when selectedFrameworks is empty", () => {
    const csv = buildControlsCsv([controlA, controlB], {}, {}, []);
    expect(csv.split("\r\n")).toHaveLength(1);
  });
});
