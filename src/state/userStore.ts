import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FrameworkId, UserState, UserControlState } from "../types";
import { FRAMEWORK_ORDER } from "../data/frameworks";

interface UserStore extends UserState {
  toggleFramework: (id: FrameworkId) => void;
  toggleCheck: (controlId: string) => void;
  setNote: (controlId: string, note: string) => void;
  exportState: () => string;
  importState: (json: string) => void;
  resetAll: () => void;
}

const DEFAULT_STATE: UserState = {
  checks: {},
  notes: {},
  selectedFrameworks: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      toggleFramework: (id) =>
        set((s) => ({
          selectedFrameworks: s.selectedFrameworks.includes(id)
            ? s.selectedFrameworks.filter((f) => f !== id)
            : [...s.selectedFrameworks, id],
        })),

      toggleCheck: (controlId) =>
        set((s) => {
          const prev: UserControlState | undefined = s.checks[controlId];
          return {
            checks: {
              ...s.checks,
              [controlId]: {
                done: !prev?.done,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      setNote: (controlId, note) =>
        set((s) => ({
          notes: { ...s.notes, [controlId]: note },
        })),

      exportState: () => {
        const { checks, notes, selectedFrameworks } = get();
        return JSON.stringify({ checks, notes, selectedFrameworks }, null, 2);
      },

      importState: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<UserState>;
          set({
            checks: parsed.checks ?? {},
            notes: parsed.notes ?? {},
            selectedFrameworks: parsed.selectedFrameworks ?? [...FRAMEWORK_ORDER],
          });
        } catch {
          alert("Invalid JSON — import failed.");
        }
      },

      resetAll: () => set({ ...DEFAULT_STATE }),
    }),
    {
      name: "lantern.user.v1",
    }
  )
);
