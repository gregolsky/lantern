import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Control, FrameworkId } from "../types";
import { FRAMEWORKS, FRAMEWORK_ORDER } from "../data/frameworks";

interface Props {
  control: Control | null;
  done: boolean;
  note: string;
  activeFrameworks: FrameworkId[];
  onClose: () => void;
  onToggleCheck: () => void;
  onNoteChange: (note: string) => void;
}

export function DetailDrawer({ control, done, note, activeFrameworks, onClose, onToggleCheck, onNoteChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!control) return null;

  const applicableFrameworks = FRAMEWORK_ORDER.filter(
    (fwId) => activeFrameworks.includes(fwId) && control.frameworks[fwId]
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-gray-900 border-l border-gray-700 flex flex-col h-full shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggleCheck}
            className="w-5 h-5 accent-indigo-400 mt-0.5 shrink-0 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{control.domain}</div>
            <h2 className="text-base font-semibold text-gray-100 leading-snug">{control.title}</h2>
            {control.description && (
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{control.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 text-xl leading-none shrink-0 mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Framework mappings */}
        <div className="p-4 flex flex-col gap-4">
          {applicableFrameworks.length > 0 && (
            <section>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Framework Requirements</h3>
              <div className="flex flex-col gap-3">
                {applicableFrameworks.map((fwId) => {
                  const meta = FRAMEWORKS[fwId];
                  const mapping = control.frameworks[fwId]!;
                  return (
                    <div key={fwId} className="rounded-lg border border-gray-700 overflow-hidden">
                      <div className={`${meta.color.bg} px-3 py-1.5 flex items-center justify-between`}>
                        <span className={`text-xs font-semibold ${meta.color.text}`}>{meta.label}</span>
                        <div className="flex gap-1 flex-wrap">
                          {mapping.refs.map((ref) => (
                            <span key={ref} className={`text-[10px] px-1.5 py-0.5 rounded bg-black/20 ${meta.color.text} font-mono`}>
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 text-sm text-gray-300 space-y-1.5">
                        {mapping.threshold && (
                          <div className="flex items-start gap-2">
                            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wide shrink-0 mt-0.5">Threshold</span>
                            <span className="text-amber-200">{mapping.threshold}</span>
                          </div>
                        )}
                        {mapping.summary && <p className="text-gray-400">{mapping.summary}</p>}
                        {mapping.citation && (
                          <a
                            href={mapping.citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:underline break-all"
                          >
                            {mapping.citation}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Notes */}
          <section>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Notes (Markdown)</h3>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add notes, links, evidence references…"
              className="w-full min-h-28 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-y font-mono"
            />
          </section>

          {note && (
            <section>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Preview</h3>
              <div className="prose prose-invert prose-sm max-w-none bg-gray-800/50 rounded-lg p-3 text-gray-300">
                <ReactMarkdown>{note}</ReactMarkdown>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
