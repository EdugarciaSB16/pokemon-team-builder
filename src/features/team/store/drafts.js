import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptySlot = null;

export const useDraftsStore = create(
  persist(
    (set, get) => ({
      drafts: [],

      saveDraft: (name, team) => {
        const { drafts } = get();
        const newDraft = {
          id: crypto.randomUUID(),
          name: name || `Borrador ${drafts.length + 1}`,
          team: team || [
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
          ],
          createdAt: Date.now(),
        };
        set({ drafts: [...drafts, newDraft] });
      },

      updateDraft: (id, updatedFields) => {
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, ...updatedFields } : d
          ),
        }));
      },

      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id),
        }));
      },

      clearDrafts: () => set({ drafts: [] }),

      getDraftById: (id) => {
        const { drafts } = get();
        return drafts.find((d) => d.id === id) || null;
      },
    }),
    {
      name: 'drafts-store',
    }
  )
);
