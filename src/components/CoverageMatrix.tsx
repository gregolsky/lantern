import type { Control, FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  controls: Control[];
  checks: Record<string, { done: boolean }>;
  activeFrameworks: FrameworkId[];
}

export function CoverageMatrix({ controls, checks, activeFrameworks }: Props) {
  const visibleFrameworks = FRAMEWORK_ORDER.filter((f) => activeFrameworks.includes(f));
  const rootControls = controls.filter((c) => !c.parentId);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs w-64">Control</th>
            {visibleFrameworks.map((fwId) => (
              <th key={fwId} className="py-2 px-2 text-center">
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${FRAMEWORKS[fwId].color.bg} ${FRAMEWORKS[fwId].color.text}`}
                >
                  {FRAMEWORKS[fwId].shortLabel}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rootControls.map((control) => {
            const done = checks[control.id]?.done ?? false;
            return (
              <tr key={control.id} className="border-b border-gray-800 hover:bg-gray-800/40">
                <td className="py-2 px-3">
                  <div className={`text-xs font-medium truncate max-w-[240px] ${done ? "line-through text-gray-500" : "text-gray-200"}`}>
                    {control.title}
                  </div>
                  <div className="text-[10px] text-gray-600">{control.domain}</div>
                </td>
                {visibleFrameworks.map((fwId) => {
                  const applies = !!control.frameworks[fwId];
                  const meta = FRAMEWORKS[fwId];
                  return (
                    <td key={fwId} className="py-2 px-2 text-center">
                      {applies ? (
                        <span
                          className={`inline-block w-5 h-5 rounded-full ${done ? "bg-gray-600" : meta.color.bg} opacity-${done ? "40" : "100"}`}
                          title={control.frameworks[fwId]?.refs.join(", ")}
                        />
                      ) : (
                        <span className="inline-block w-5 h-5 rounded-full border border-gray-700" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
