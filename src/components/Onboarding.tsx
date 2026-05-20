import { useState } from "react";
import type { FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

const BASE = import.meta.env.BASE_URL;

interface Props {
  onConfirm: (selected: FrameworkId[]) => void;
  onBack?: () => void;
}

const EXTENDED: Record<FrameworkId, { who: string; controls: string }> = {
  ISO27001: {
    who: "SaaS companies, enterprises, government contractors",
    controls: "Annex A controls A.5 – A.8",
  },
  SOC2: {
    who: "US-based SaaS & cloud service providers",
    controls: "AICPA TSC: CC, A, C, PI, P criteria",
  },
  NIS2: {
    who: "EU essential & important entities in critical sectors",
    controls: "Article 21 cybersecurity measures",
  },
  HIPAA: {
    who: "US healthcare providers & business associates",
    controls: "§164 administrative, physical & technical safeguards",
  },
  GDPR: {
    who: "Any org processing personal data of EU residents",
    controls: "Articles 5, 13–17, 25, 32–36",
  },
};

export function Onboarding({ onConfirm, onBack }: Props) {
  const [selected, setSelected] = useState<FrameworkId[]>([]);

  function toggle(id: FrameworkId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        {/* Back */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 text-sm text-gray-600 hover:text-gray-300 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
        )}

        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Choose your frameworks</h1>
          <p className="text-gray-400 text-base">
            Select one or more compliance frameworks to track. Lantern maps your controls across all of them simultaneously.
          </p>
          <p className="text-gray-600 text-sm mt-1">You can change this at any time from the header.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {FRAMEWORK_ORDER.map((fwId) => {
            const meta = FRAMEWORKS[fwId];
            const ext = EXTENDED[fwId];
            const active = selected.includes(fwId);
            return (
              <button
                key={fwId}
                onClick={() => toggle(fwId)}
                className={[
                  "text-left rounded-xl border-2 transition-all flex flex-col overflow-hidden",
                  active
                    ? `${meta.color.bg} border-transparent shadow-lg`
                    : "bg-gray-900 border-gray-700 hover:border-gray-500",
                ].join(" ")}
              >
                {/* Framework image banner */}
                <div className="relative w-full aspect-square bg-gray-800 shrink-0">
                  <img
                    src={BASE + "icons/fw-" + fwId.toLowerCase() + ".jpeg"}
                    alt={meta.label}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {active && (
                    <span className="absolute top-2 right-2 text-white/90 text-xs font-semibold bg-black/40 rounded-full px-2 py-0.5">✓</span>
                  )}
                </div>

                {/* Text content */}
                <div className="p-4 flex flex-col gap-2">
                  <span className={`text-sm font-bold ${active ? meta.color.text : "text-gray-200"}`}>
                    {meta.label}
                  </span>

                  <p className={`text-xs leading-relaxed ${active ? "text-white/80" : "text-gray-400"}`}>
                    {meta.description}
                  </p>

                  <div className={`pt-1.5 border-t ${active ? "border-white/20" : "border-gray-800"}`}>
                    <div className={`text-xs ${active ? "text-white/60" : "text-gray-600"}`}>
                      <span className="font-medium">Who:</span> {ext.who}
                    </div>
                    <div className={`text-xs mt-0.5 ${active ? "text-white/60" : "text-gray-600"}`}>
                      <span className="font-medium">Covers:</span> {ext.controls}
                    </div>
                  </div>

                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`text-xs underline-offset-2 underline mt-auto ${active ? "text-white/50 hover:text-white/80" : "text-gray-700 hover:text-gray-400"} transition-colors`}
                  >
                    Official source ↗
                  </a>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress hint */}
        {selected.length > 0 && (
          <p className="text-center text-xs text-gray-600 mb-4">
            {selected.length} framework{selected.length > 1 ? "s" : ""} selected
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            disabled={selected.length === 0}
            onClick={() => onConfirm(selected)}
            className="px-10 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/40"
          >
            {selected.length === 0
              ? "Select at least one framework"
              : `Start tracking ${selected.length} framework${selected.length > 1 ? "s" : ""} →`}
          </button>
          <button
            onClick={() => onConfirm([...FRAMEWORK_ORDER])}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Select all and continue
          </button>
        </div>
      </div>
    </div>
  );
}
