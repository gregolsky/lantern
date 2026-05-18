import type { FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  selectedFrameworks: FrameworkId[];
  onToggle: (id: FrameworkId) => void;
}

export function FrameworkFilter({ selectedFrameworks, onToggle }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FRAMEWORK_ORDER.map((fwId) => {
        const meta = FRAMEWORKS[fwId];
        const active = selectedFrameworks.includes(fwId);
        return (
          <button
            key={fwId}
            onClick={() => onToggle(fwId)}
            title={meta.description}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
              active
                ? `${meta.color.bg} ${meta.color.text} border-transparent`
                : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400",
            ].join(" ")}
          >
            {meta.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
