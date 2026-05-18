import { useState } from "react";
import type { FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  onConfirm: (selected: FrameworkId[]) => void;
}

export function Onboarding({ onConfirm }: Props) {
  const [selected, setSelected] = useState<FrameworkId[]>([]);

  function toggle(id: FrameworkId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🪔</div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Welcome to Lantern</h1>
          <p className="text-gray-400 text-lg">Which frameworks do you want to track?</p>
          <p className="text-gray-600 text-sm mt-1">You can change this at any time from the header.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {FRAMEWORK_ORDER.map((fwId) => {
            const meta = FRAMEWORKS[fwId];
            const active = selected.includes(fwId);
            return (
              <button
                key={fwId}
                onClick={() => toggle(fwId)}
                className={[
                  "text-left p-4 rounded-xl border-2 transition-all",
                  active
                    ? `${meta.color.bg} border-transparent`
                    : "bg-gray-900 border-gray-700 hover:border-gray-500",
                ].join(" ")}
              >
                <div className={`text-sm font-bold mb-1 ${active ? meta.color.text : "text-gray-200"}`}>
                  {meta.label}
                </div>
                <div className={`text-xs leading-relaxed ${active ? "text-white/70" : "text-gray-500"}`}>
                  {meta.description}
                </div>
                {active && (
                  <div className="mt-2 text-white/80 text-xs font-semibold">✓ Selected</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            disabled={selected.length === 0}
            onClick={() => onConfirm(selected)}
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
          >
            {selected.length === 0
              ? "Select at least one framework"
              : `Start tracking ${selected.length} framework${selected.length > 1 ? "s" : ""} →`}
          </button>
          <button
            onClick={() => onConfirm([...FRAMEWORK_ORDER])}
            className="text-xs text-gray-600 hover:text-gray-400"
          >
            Select all and continue
          </button>
        </div>
      </div>
    </div>
  );
}
