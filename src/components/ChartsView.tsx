import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import type { Control, FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  controls: Control[];
  checks: Record<string, { done: boolean }>;
  activeFrameworks: FrameworkId[];
}

function getFrameworkStats(controls: Control[], checks: Record<string, { done: boolean }>, fwId: FrameworkId) {
  const applicable = controls.filter((c) => !!c.frameworks[fwId]);
  const done = applicable.filter((c) => checks[c.id]?.done).length;
  return { total: applicable.length, done, pct: applicable.length ? Math.round((done / applicable.length) * 100) : 0 };
}

const TAIL_COLORS: Record<string, string> = {
  ISO27001: "#0369a1",
  SOC2: "#4f46e5",
  NIS2: "#d97706",
  HIPAA: "#dc2626",
  GDPR: "#059669",
};

export function ChartsView({ controls, checks, activeFrameworks }: Props) {
  const visibleFrameworks = FRAMEWORK_ORDER.filter((f) => activeFrameworks.includes(f));
  const radarData = visibleFrameworks.map((fwId) => {
    const { pct } = getFrameworkStats(controls, checks, fwId);
    return { framework: FRAMEWORKS[fwId].shortLabel, value: pct };
  });

  return (
    <div className="p-6 space-y-10">
      {/* Radar / spider */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Overall Completion Radar</h2>
        <div className="bg-gray-800/40 rounded-xl p-4" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="framework" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Radar
                name="Completion %"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                dot={{ fill: "#6366f1", r: 3 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
                itemStyle={{ color: "#e5e7eb" }}
                formatter={(v) => [`${v}%`, "Completion"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Per-framework pie charts */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Per-Framework Completion</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {visibleFrameworks.map((fwId) => {
            const meta = FRAMEWORKS[fwId];
            const { done, total, pct } = getFrameworkStats(controls, checks, fwId);
            const remaining = total - done;
            const color = TAIL_COLORS[fwId] ?? "#6b7280";
            const pieData = total === 0
              ? [{ name: "No controls", value: 1 }]
              : [
                  { name: "Done", value: done },
                  { name: "Remaining", value: remaining },
                ];

            return (
              <div key={fwId} className="bg-gray-800/40 rounded-xl p-4 flex flex-col items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${meta.color.bg} ${meta.color.text}`}>
                  {meta.shortLabel}
                </span>
                <div style={{ width: 110, height: 110 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        strokeWidth={0}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? color : "#374151"} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-100">{pct}%</div>
                  <div className="text-xs text-gray-500">{done}/{total} controls</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
