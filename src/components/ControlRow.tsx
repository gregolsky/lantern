import type { Control, FrameworkId } from "../types";
import { FrameworkChips } from "./FrameworkChips";

interface Props {
  control: Control;
  done: boolean;
  hasNote: boolean;
  isChild: boolean;
  activeFrameworks: FrameworkId[];
  filterFramework: FrameworkId | null;
  isSelected: boolean;
  onToggleCheck: () => void;
  onSelect: () => void;
  onChipClick: (id: FrameworkId) => void;
}

export function ControlRow({
  control,
  done,
  hasNote,
  isChild,
  activeFrameworks,
  filterFramework,
  isSelected,
  onToggleCheck,
  onSelect,
  onChipClick,
}: Props) {
  return (
    <div
      className={[
        "group flex items-center gap-3 px-4 py-2.5 border-b border-gray-800 transition-colors",
        isChild ? "pl-10 bg-gray-900/40" : "",
        isSelected ? "bg-gray-800" : "hover:bg-gray-800/60",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={onToggleCheck}
        className="w-4 h-4 accent-indigo-400 shrink-0 cursor-pointer"
      />

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
        <div className="flex items-center gap-1.5">
          {isChild && (
            <span className="text-gray-500 text-xs shrink-0" title="Specialization of parent control">⑂</span>
          )}
          <span className={`text-sm font-medium truncate ${done ? "line-through text-gray-500" : "text-gray-100"}`}>
            {control.title}
          </span>
          {hasNote && (
            <span className="text-[10px] text-gray-500 shrink-0" title="Has notes">✎</span>
          )}
        </div>
      </div>

      <FrameworkChips
        control={control}
        activeFrameworks={activeFrameworks}
        filterFramework={filterFramework}
        onChipClick={onChipClick}
      />
    </div>
  );
}
