import type { Control, FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  control: Control;
  activeFrameworks: FrameworkId[];
  filterFramework: FrameworkId | null;
  onChipClick: (id: FrameworkId) => void;
}

export function FrameworkChips({ control, activeFrameworks, filterFramework, onChipClick }: Props) {
  return (
    <div className="flex gap-1 items-center shrink-0">
      {FRAMEWORK_ORDER.map((fwId) => {
        const meta = FRAMEWORKS[fwId];
        const applies = !!control.frameworks[fwId];
        const active = activeFrameworks.includes(fwId);
        const highlighted = filterFramework === fwId;

        if (!active && !applies) return null;

        return (
          <button
            key={fwId}
            onClick={(e) => { e.stopPropagation(); onChipClick(fwId); }}
            title={meta.label}
            className={[
              "text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-all select-none",
              applies && active
                ? `${meta.color.bg} ${meta.color.text} border-transparent ${highlighted ? "ring-2 ring-offset-1 ring-white/50" : ""}`
                : "bg-transparent border-gray-600 text-gray-500",
            ].join(" ")}
          >
            {meta.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
