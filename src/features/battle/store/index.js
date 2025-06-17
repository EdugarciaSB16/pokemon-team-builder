import { create } from 'zustand';

export const useBattleStore = create((set) => ({
  selectedTeamA: null,
  selectedTeamB: null,
  battleResult: null,

  selectTeamA: (team) => set({ selectedTeamA: team }),
  selectTeamB: (team) => set({ selectedTeamB: team }),
  clearSelection: () =>
    set({ selectedTeamA: null, selectedTeamB: null, battleResult: null }),

  setBattleResult: (result) => set({ battleResult: result }),

  // Aquí irá la lógica de simulación de combate en el futuro
}));
