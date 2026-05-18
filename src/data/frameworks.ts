import type { FrameworkId } from "../types";

export interface FrameworkMeta {
  id: FrameworkId;
  label: string;
  shortLabel: string;
  color: {
    bg: string;
    text: string;
    border: string;
    ghost: string;
  };
  description: string;
  url: string;
}

export const FRAMEWORK_ORDER: FrameworkId[] = ["ISO27001", "SOC2", "NIS2", "HIPAA", "GDPR"];

export const FRAMEWORKS: Record<FrameworkId, FrameworkMeta> = {
  ISO27001: {
    id: "ISO27001",
    label: "ISO 27001:2022",
    shortLabel: "ISO",
    color: {
      bg: "bg-sky-700",
      text: "text-white",
      border: "border-sky-700",
      ghost: "border-sky-400 text-sky-400",
    },
    description: "Information security management system standard",
    url: "https://www.iso.org/standard/27001",
  },
  SOC2: {
    id: "SOC2",
    label: "SOC 2 (TSC 2017)",
    shortLabel: "SOC2",
    color: {
      bg: "bg-indigo-600",
      text: "text-white",
      border: "border-indigo-600",
      ghost: "border-indigo-300 text-indigo-300",
    },
    description: "AICPA Trust Services Criteria — Security, Availability, Confidentiality",
    url: "https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022",
  },
  NIS2: {
    id: "NIS2",
    label: "NIS2 Directive",
    shortLabel: "NIS2",
    color: {
      bg: "bg-amber-600",
      text: "text-white",
      border: "border-amber-600",
      ghost: "border-amber-300 text-amber-300",
    },
    description: "EU Directive 2022/2555 — network and information security",
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
  },
  HIPAA: {
    id: "HIPAA",
    label: "HIPAA Security Rule",
    shortLabel: "HIPAA",
    color: {
      bg: "bg-rose-600",
      text: "text-white",
      border: "border-rose-600",
      ghost: "border-rose-300 text-rose-300",
    },
    description: "45 CFR §164 — Administrative, Physical, Technical safeguards",
    url: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C",
  },
  GDPR: {
    id: "GDPR",
    label: "GDPR",
    shortLabel: "GDPR",
    color: {
      bg: "bg-emerald-600",
      text: "text-white",
      border: "border-emerald-600",
      ghost: "border-emerald-300 text-emerald-300",
    },
    description: "EU Regulation 2016/679 — General Data Protection Regulation",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  },
};
