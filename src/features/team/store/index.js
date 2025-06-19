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
      // Current loaded team (for battle validation)
      currentLoadedTeam: null,
      // Notification state
      notification: null,

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
          currentLoadedTeam: null,
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
          currentLoadedTeam: null,
        });
      },

      // Clear all slots
      clearTeam: () => {
        set({
          slots: EMPTY_TEAM,
          isDraft: false,
          currentLoadedTeam: null,
        });
      },

      // Reorder slots with drag and drop
      reorderTeam: (newOrder) =>
        set({
          slots: newOrder,
          isDraft: true,
          currentLoadedTeam: null,
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
          currentLoadedTeam: null,
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
          currentLoadedTeam: null,
        });
      },

      // Save current team
      saveTeam: (name) => {
        const { slots, savedTeams } = get();
        const validTeam = slots.filter(Boolean);
        if (validTeam.length !== 6) return false;

        const newTeam = {
          id: crypto.randomUUID(),
          name: name || `Team ${savedTeams.length + 1}`,
          slots: [...slots],
          createdAt: Date.now(),
        };

        set({
          savedTeams: [...savedTeams, newTeam],
          currentLoadedTeam: newTeam,
          isDraft: false,
          notification: {
            type: 'success',
            message: `Team "${newTeam.name}" saved successfully! Ready to battle!`,
            duration: 3000,
          },
        });

        return true;
      },

      // Load a saved team
      loadTeam: (team) => {
        set({
          slots: [...team.slots],
          currentLoadedTeam: team,
          isDraft: false,
          notification: {
            type: 'info',
            message: `Team "${team.name}" loaded! Ready to battle!`,
            duration: 3000,
          },
        });
      },

      // Delete a saved team
      deleteTeam: (id) => {
        const { savedTeams, currentLoadedTeam } = get();
        const newSavedTeams = savedTeams.filter((team) => team.id !== id);

        set({
          savedTeams: newSavedTeams,
          // Clear current loaded team if it was deleted
          currentLoadedTeam:
            currentLoadedTeam?.id === id ? null : currentLoadedTeam,
        });
      },

      // Clear notification
      clearNotification: () => {
        set({ notification: null });
      },

      // Check if current team is ready for battle
      isTeamReadyForBattle: () => {
        const { slots, currentLoadedTeam } = get();
        const filledSlots = slots.filter(Boolean).length;
        return filledSlots === 6 && currentLoadedTeam !== null;
      },

      // Get current team for battle
      getCurrentTeamForBattle: () => {
        const { slots, currentLoadedTeam } = get();
        if (!currentLoadedTeam) return null;
        return {
          id: currentLoadedTeam.id,
          name: currentLoadedTeam.name,
          pokemons: slots.filter(Boolean),
        };
      },
    }),
    {
      name: 'team-store',
    }
  )
);
