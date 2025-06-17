import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptySlot = null;

export const useTeamStore = create(
  persist(
    (set, get) => ({
      team: [emptySlot, emptySlot, emptySlot, emptySlot, emptySlot, emptySlot],
      savedTeams: [],
      draftName: '',

      addPokemon: (pokemon) => {
        const { team } = get();
        const index = team.findIndex((slot) => slot === null);
        if (index === -1) return;
        const newTeam = [...team];
        newTeam[index] = pokemon;
        set({ team: newTeam });
      },

      removePokemon: (index) => {
        const { team } = get();
        const newTeam = [...team];
        newTeam[index] = null;
        set({ team: newTeam });
      },

      reorderTeam: (newOrder) => set({ team: newOrder }),

      randomizeTeam: () => {
        const { team } = get();
        const shuffled = [...team].sort(() => Math.random() - 0.5);
        set({ team: shuffled });
      },

      sortByAttack: () => {
        const { team } = get();
        const sorted = [...team].filter(Boolean).sort((a, b) => {
          const aAtk =
            a.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
          const bAtk =
            b.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
          return bAtk - aAtk;
        });

        const filled = [...sorted, ...Array(6 - sorted.length).fill(null)];
        set({ team: filled });
      },

      saveTeam: (name) => {
        const { team, savedTeams } = get();
        const validTeam = team.filter(Boolean);
        if (validTeam.length === 0) return;

        const newTeam = {
          id: crypto.randomUUID(),
          name: name || `Equipo ${savedTeams.length + 1}`,
          pokemons: [...team],
        };

        set({
          savedTeams: [...savedTeams, newTeam],
          team: [
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
          ],
          draftName: '',
        });
      },

      deleteTeam: (id) => {
        const { savedTeams } = get();
        set({ savedTeams: savedTeams.filter((team) => team.id !== id) });
      },

      editTeamName: (id, newName) => {
        const { savedTeams } = get();
        set({
          savedTeams: savedTeams.map((team) =>
            team.id === id ? { ...team, name: newName } : team
          ),
        });
      },

      duplicateTeam: (id) => {
        const { savedTeams } = get();
        const teamToDuplicate = savedTeams.find((team) => team.id === id);
        if (!teamToDuplicate) return;
        const duplicatedTeam = {
          ...teamToDuplicate,
          id: crypto.randomUUID(),
          name: `${teamToDuplicate.name} (Copia)`,
        };
        set({ savedTeams: [...savedTeams, duplicatedTeam] });
      },

      saveDraft: (name) => {
        set({ draftName: name || 'Borrador automático' });
      },

      discardDraft: () => {
        set({
          team: [
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
            emptySlot,
          ],
          draftName: '',
        });
      },
    }),
    {
      name: 'team-store',
    }
  )
);
