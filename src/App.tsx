import { useState, useMemo, useRef } from "react";
import type { Control, FrameworkId, ViewMode } from "./types";
import { FRAMEWORK_ORDER } from "./data/frameworks";
import { useUserStore } from "./state/userStore";
import { ControlRow } from "./components/ControlRow";
import { FrameworkFilter } from "./components/FrameworkFilter";
import { DetailDrawer } from "./components/DetailDrawer";
import { CoverageMatrix } from "./components/CoverageMatrix";
import { ProgressBars } from "./components/ProgressBars";
import { ChartsView } from "./components/ChartsView";
import { Onboarding } from "./components/Onboarding";
import { LandingPage } from "./components/LandingPage";
import seedData from "./data/controls.seed.json";

const ALL_CONTROLS = seedData as Control[];

export default function App() {
  const {
    checks,
    notes,
    selectedFrameworks,
    toggleFramework,
    toggleCheck,
    setNote,
    exportState,
    importState,
    resetAll,
  } = useUserStore();

  const [screen, setScreen] = useState<"landing" | "onboarding">(
    selectedFrameworks.length > 0 ? "onboarding" : "landing"
  );
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [filterFramework, setFilterFramework] = useState<FrameworkId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  const visibleControls = useMemo(() => {
    return ALL_CONTROLS.filter((c) => {
      const frameworkMatch = FRAMEWORK_ORDER.some(
        (fwId) => selectedFrameworks.includes(fwId) && !!c.frameworks[fwId]
      );
      if (!frameworkMatch) return false;
      if (filterFramework && !c.frameworks[filterFramework]) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedFrameworks, filterFramework, searchQuery]);

  const groupedControls = useMemo(() => {
    const childrenByParent: Record<string, Control[]> = {};
    visibleControls.filter(c => c.parentId).forEach(c => {
      (childrenByParent[c.parentId!] ??= []).push(c);
    });
    const ordered: Control[] = [];
    visibleControls.filter(c => !c.parentId).forEach(root => {
      ordered.push(root);
      childrenByParent[root.id]?.forEach(child => ordered.push(child));
    });
    const groups: { domain: string; controls: Control[] }[] = [];
    for (const c of ordered) {
      const last = groups.at(-1);
      if (last?.domain === c.domain) last.controls.push(c);
      else groups.push({ domain: c.domain, controls: [c] });
    }
    return groups;
  }, [visibleControls]);

  const selectedControl = ALL_CONTROLS.find((c) => c.id === selectedControlId) ?? null;

  function handleChipClick(fwId: FrameworkId) {
    setFilterFramework((prev) => (prev === fwId ? null : fwId));
  }

  function handleExport() {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lantern-state.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importState(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  }

  if (selectedFrameworks.length === 0) {
    if (screen === "landing") {
      return <LandingPage onGetStarted={() => setScreen("onboarding")} />;
    }
    return (
      <Onboarding
        onConfirm={(frameworks) => frameworks.forEach(toggleFramework)}
        onBack={() => setScreen("landing")}
      />
    );
  }

  const totalControls = visibleControls.filter((c) => !c.parentId).length;
  const doneControls = visibleControls.filter((c) => !c.parentId && checks[c.id]?.done).length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Row 1: logo + view tabs */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-indigo-400">🪔 Lantern</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Multi-framework compliance tracker</span>
            </div>
            <div className="flex-1" />
            <div className="flex gap-1">
              {(["list", "matrix", "charts"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2.5 py-1 rounded text-xs capitalize ${viewMode === mode ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: framework filter + search + export/import + done counter */}
          <div className="flex flex-wrap items-center gap-2">
            <FrameworkFilter selectedFrameworks={selectedFrameworks} onToggle={toggleFramework} />
            <div className="flex-1" />
            {viewMode === "list" && (
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search controls…"
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
              />
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{doneControls}/{totalControls} done</span>
              <button onClick={handleExport} className="px-2.5 py-1 rounded text-xs text-gray-400 hover:text-gray-200 border border-gray-700">
                Export
              </button>
              <button
                onClick={() => importRef.current?.click()}
                className="px-2.5 py-1 rounded text-xs text-gray-400 hover:text-gray-200 border border-gray-700"
              >
                Import
              </button>
              <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </div>
          </div>

          {viewMode === "list" && (
            <div className="mt-3">
              <ProgressBars controls={ALL_CONTROLS} checks={checks} activeFrameworks={selectedFrameworks} />
            </div>
          )}

          {filterFramework && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Filtering by:</span>
              <button
                onClick={() => setFilterFramework(null)}
                className="text-xs text-indigo-400 hover:underline"
              >
                {filterFramework} ×
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full">
        {viewMode === "list" && (
          <div>
            {visibleControls.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-4xl mb-3">🔍</div>
                <p>No controls match your current filters.</p>
              </div>
            ) : (
              groupedControls.map(({ domain, controls }) => (
                <div key={domain}>
                  <div className="px-4 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest bg-gray-900 border-b border-t border-gray-800">
                    {domain}
                  </div>
                  {controls.map((control) => (
                    <ControlRow
                      key={control.id}
                      control={control}
                      done={checks[control.id]?.done ?? false}
                      hasNote={!!(notes[control.id]?.trim())}
                      isChild={!!control.parentId}
                      activeFrameworks={selectedFrameworks}
                      filterFramework={filterFramework}
                      isSelected={selectedControlId === control.id}
                      onToggleCheck={() => toggleCheck(control.id)}
                      onSelect={() => setSelectedControlId((prev) => (prev === control.id ? null : control.id))}
                      onChipClick={handleChipClick}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {viewMode === "matrix" && (
          <div className="p-4">
            <CoverageMatrix
              controls={visibleControls}
              checks={checks}
              activeFrameworks={selectedFrameworks}
            />
          </div>
        )}

        {viewMode === "charts" && (
          <ChartsView
            controls={ALL_CONTROLS}
            checks={checks}
            activeFrameworks={selectedFrameworks}
          />
        )}
      </main>

      {/* Detail drawer */}
      {selectedControlId && (
        <DetailDrawer
          control={selectedControl}
          done={checks[selectedControlId]?.done ?? false}
          note={notes[selectedControlId] ?? ""}
          activeFrameworks={selectedFrameworks}
          onClose={() => setSelectedControlId(null)}
          onToggleCheck={() => toggleCheck(selectedControlId)}
          onNoteChange={(note) => setNote(selectedControlId, note)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-3 px-4 text-center text-xs text-gray-600">
        Data: ISO 27001:2022 (IDs/titles only, ISO ©) · SOC 2 TSC (authored summaries, AICPA ©) · NIS2 &amp; GDPR (EUR-Lex, CC BY) · HIPAA (eCFR, public domain)
        {" · "}
        <button
          onClick={() => { if (confirm("Reset all progress and notes?")) resetAll(); }}
          className="text-gray-500 hover:text-red-400"
        >
          Reset all
        </button>
      </footer>
    </div>
  );
}
