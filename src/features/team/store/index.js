import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EMPTY_SLOT = null;
const EMPTY_TEAM = Array(6).fill(EMPTY_SLOT);

// Helper function to clean Pokemon data before storage
const cleanPokemonData = (pokemon) => ({
  id: pokemon.id,
  name: pokemon.name,
  sprites: {
    front_default: pokemon.sprites.front_default,
    other: {
      'official-artwork': {
        front_default:
          pokemon.sprites.other?.['official-artwork']?.front_default,
      },
    },
  },
  types: pokemon.types.map((t) => ({ type: { name: t.type.name } })),
  stats: pokemon.stats.map((s) => ({
    base_stat: s.base_stat,
    stat: { name: s.stat.name },
  })),
});

export const useTeamStore = create(
  persist(
    (set, get) => ({
      slots: EMPTY_TEAM,
      savedTeams: [],
      isDraft: false,
      currentLoadedTeam: null,
      notification: null,

      addPokemon: (pokemon) => {
        const { slots } = get();
        const index = slots.findIndex((slot) => slot === EMPTY_SLOT);
        if (index === -1) return;

        const newSlots = [...slots];
        newSlots[index] = cleanPokemonData(pokemon);
        set({
          slots: newSlots,
          isDraft: true,
          currentLoadedTeam: null,
        });
      },

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

      clearTeam: () => {
        set({
          slots: EMPTY_TEAM,
          isDraft: false,
          currentLoadedTeam: null,
        });
      },

      reorderTeam: (newOrder) =>
        set({
          slots: newOrder,
          isDraft: true,
          currentLoadedTeam: null,
        }),

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

      deleteTeam: (id) => {
        const { savedTeams, currentLoadedTeam } = get();
        const newSavedTeams = savedTeams.filter((team) => team.id !== id);

        set({
          savedTeams: newSavedTeams,
          currentLoadedTeam:
            currentLoadedTeam?.id === id ? null : currentLoadedTeam,
        });
      },

      clearNotification: () => {
        set({ notification: null });
      },

      isTeamReadyForBattle: () => {
        const { slots, currentLoadedTeam } = get();
        const filledSlots = slots.filter(Boolean).length;
        return filledSlots === 6 && currentLoadedTeam !== null;
      },

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
