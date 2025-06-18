import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EMPTY_SLOT = null;
const EMPTY_TEAM = Array(6).fill(EMPTY_SLOT);

export const useTeamStore = create(
  persist(
    (set, get) => ({
      // Current team in slots
      slots: EMPTY_TEAM,
      // Saved teams
      savedTeams: [],
      // Draft state
      isDraft: false,

      // Add pokemon to first empty slot
      addPokemon: (pokemon) => {
        const { slots } = get();
        const index = slots.findIndex((slot) => slot === EMPTY_SLOT);
        if (index === -1) return;

        const newSlots = [...slots];
        newSlots[index] = pokemon;
        set({
          slots: newSlots,
          isDraft: true,
        });
      },

      // Remove pokemon from specific slot
      removePokemon: (index) => {
        const { slots } = get();
        const newSlots = [...slots];
        newSlots[index] = EMPTY_SLOT;
        set({
          slots: newSlots,
          isDraft: newSlots.some(Boolean),
        });
      },

      // Clear all slots
      clearTeam: () => {
        set({
          slots: EMPTY_TEAM,
          isDraft: false,
        });
      },

      // Reorder slots with drag and drop
      reorderTeam: (newOrder) =>
        set({
          slots: newOrder,
          isDraft: true,
        }),

      // Randomize team order
      randomizeTeam: () => {
        const { slots } = get();
        const pokemons = slots.filter(Boolean);
        const shuffled = [...pokemons].sort(() => Math.random() - 0.5);
        const newSlots = [...EMPTY_TEAM];
        shuffled.forEach((pokemon, index) => {
          newSlots[index] = pokemon;
        });
        set({
          slots: newSlots,
          isDraft: true,
        });
      },

      // Sort by attack stat
      sortByAttack: () => {
        const { slots } = get();
        const pokemons = slots.filter(Boolean);
        const sorted = pokemons.sort((a, b) => {
          const aAtk =
            a.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
          const bAtk =
            b.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
          return bAtk - aAtk;
        });
        const newSlots = [...EMPTY_TEAM];
        sorted.forEach((pokemon, index) => {
          newSlots[index] = pokemon;
        });
        set({
          slots: newSlots,
          isDraft: true,
        });
      },

      // Save current team
      saveTeam: (name) => {
        const { slots, savedTeams } = get();
        const validTeam = slots.filter(Boolean);
        if (validTeam.length !== 6) return;

        const newTeam = {
          id: crypto.randomUUID(),
          name: name || `Team ${savedTeams.length + 1}`,
          slots: [...slots],
          createdAt: Date.now(),
        };

        set({
          savedTeams: [...savedTeams, newTeam],
          slots: EMPTY_TEAM,
          isDraft: false,
        });
      },

      // Load a saved team
      loadTeam: (team) => {
        set({
          slots: [...team.slots],
          isDraft: false,
        });
      },

      // Delete a saved team
      deleteTeam: (id) => {
        const { savedTeams } = get();
        set({
          savedTeams: savedTeams.filter((team) => team.id !== id),
        });
      },
    }),
    {
      name: 'team-store',
    }
  )
);
