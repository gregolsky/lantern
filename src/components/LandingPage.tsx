import type { FrameworkId } from "../types";
import { FRAMEWORK_ORDER, FRAMEWORKS } from "../data/frameworks";

interface Props {
  onGetStarted: () => void;
}

const BASE = import.meta.env.BASE_URL;

const FEATURES = [
  {
    img: BASE + "icons/list-view.jpeg",
    title: "List view",
    desc: "Step through every control with checkboxes, inline notes, and per-framework requirement details.",
  },
  {
    img: BASE + "icons/matrix.jpeg",
    title: "Coverage matrix",
    desc: "See at a glance which controls map to which frameworks in a scrollable heatmap grid.",
  },
  {
    img: BASE + "icons/radar.jpeg",
    title: "Radar & charts",
    desc: "Visualize completion across frameworks with radar and donut charts powered by Recharts.",
  },
  {
    img: BASE + "icons/export.jpeg",
    title: "Export & import",
    desc: "All progress lives in your browser. Export a JSON snapshot, share it, or import it on another device.",
  },
];

export function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-lg font-bold text-indigo-400 tracking-tight">🪔 Lantern</span>
        <button
          onClick={onGetStarted}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Get started
        </button>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto w-full px-6 py-16 lg:py-24">
        {/* Left: copy */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3">
              Multi-framework compliance tracker
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-100">
              Navigate compliance<br />
              <span className="text-indigo-400">like an explorer.</span>
            </h1>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Lantern lights the path through ISO 27001, SOC 2, NIS2, HIPAA, and GDPR — all in one
            offline-first, zero-account tool that lives in your browser.
          </p>

          {/* Framework badges */}
          <div className="flex flex-wrap gap-2">
            {FRAMEWORK_ORDER.map((fwId: FrameworkId) => {
              const meta = FRAMEWORKS[fwId];
              return (
                <span
                  key={fwId}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color.bg} ${meta.color.text}`}
                >
                  {meta.shortLabel}
                </span>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-900/40"
            >
              Get started — it's free →
            </button>
            <span className="flex items-center text-sm text-gray-600 gap-1.5">
              <span className="text-green-500">●</span> No account · No server · Runs offline
            </span>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 aspect-square flex items-center justify-center">
            <img
              src={BASE + "hero.jpeg"}
              alt="Wizard with a lantern navigating a dungeon"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800 bg-gray-900/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-200 mb-8 text-center">Everything you need to track compliance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col"
              >
                {/* Section image */}
                <div className="relative w-full aspect-square bg-gray-800">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                </div>
                {/* Text */}
                <div className="p-4 flex flex-col gap-1.5">
                  <h3 className="font-semibold text-gray-100 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-xl mx-auto text-center px-6 flex flex-col items-center gap-6">
          <div className="text-4xl">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-100">Ready to start your compliance journey?</h2>
          <p className="text-gray-400 text-sm">
            Pick the frameworks that matter to your organisation and Lantern maps every control across all of them.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Choose your frameworks →
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-700">
        Lantern — open source compliance tracker · No account required
      </footer>
    </div>
  );
}
