import type { Control, FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  controls: Control[];
  checks: Record<string, { done: boolean }>;
  activeFrameworks: FrameworkId[];
}

export function ProgressBars({ controls, checks, activeFrameworks }: Props) {
  const visible = FRAMEWORK_ORDER.filter((f) => activeFrameworks.includes(f));

  return (
    <div className="flex gap-4 flex-wrap">
      {visible.map((fwId) => {
        const meta = FRAMEWORKS[fwId];
        const applicable = controls.filter((c) => !!c.frameworks[fwId]);
        const done = applicable.filter((c) => checks[c.id]?.done).length;
        const pct = applicable.length ? Math.round((done / applicable.length) * 100) : 0;

        return (
          <div key={fwId} className="flex items-center gap-2 min-w-28">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${meta.color.bg} ${meta.color.text} shrink-0`}>
              {meta.shortLabel}
            </span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden min-w-16">
              <div
                className={`h-full ${meta.color.bg} transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 shrink-0 w-8 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
