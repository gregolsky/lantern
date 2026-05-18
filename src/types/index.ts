export type FrameworkId = "ISO27001" | "SOC2" | "NIS2" | "HIPAA" | "GDPR";

export interface FrameworkRef {
  id: string;
  title: string;
  citation?: string;
}

export interface FrameworkMapping {
  refs: string[];           // e.g. ["A.5.24", "A.5.26"]
  threshold?: string;       // e.g. "Notify supervisory authority within 72h"
  citation?: string;        // URL to authoritative source
  summary?: string;         // one-line authored description
}

export interface Control {
  id: string;
  title: string;
  domain: string;
  description?: string;
  frameworks: Partial<Record<FrameworkId, FrameworkMapping>>;
  parentId?: string;        // set on child variants (specializations)
}

export type Applicability = "required" | "addressable" | "conditional" | "recommended";

export interface FrameworkControl {
  id: string;               // e.g. "A.5.24"
  title: string;
  description?: string;
  theme?: string;           // ISO themes, TSC categories, HIPAA types, etc.
  category?: string;
  applicability?: Applicability;  // HIPAA required vs addressable, etc.
  citation?: string;
}

export interface UserControlState {
  done: boolean;
  updatedAt: string;        // ISO 8601
}

export interface UserState {
  checks: Record<string, UserControlState>;
  notes: Record<string, string>;             // markdown
  selectedFrameworks: FrameworkId[];
}

export type ViewMode = "list" | "matrix" | "charts";
