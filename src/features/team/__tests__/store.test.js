import { renderHook, act } from '@testing-library/react';
import { useTeamStore } from '../store';

// Mock Zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (config) => config,
}));

describe('Team Store', () => {
  beforeEach(() => {
    useTeamStore.setState({
      slots: Array(6).fill(null),
      savedTeams: [],
      isDraft: false,
      currentLoadedTeam: null,
      notification: null,
    });
  });

  describe('addPokemon', () => {
    test('should add pokemon to first empty slot', () => {
      const { result } = renderHook(() => useTeamStore());
      const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default: 'test.png',
          other: { 'official-artwork': { front_default: 'art.png' } },
        },
        types: [{ type: { name: 'grass' } }],
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      };

      act(() => {
        result.current.addPokemon(mockPokemon);
      });

      expect(result.current.slots[0]).toEqual({
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default: 'test.png',
          other: { 'official-artwork': { front_default: 'art.png' } },
        },
        types: [{ type: { name: 'grass' } }],
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      });
      expect(result.current.isDraft).toBe(true);
      expect(result.current.currentLoadedTeam).toBeNull();
    });

    test('should not add pokemon when team is full', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({ id: 1, name: 'test' });

      act(() => {
        useTeamStore.setState({ slots: fullTeam });
      });

      const mockPokemon = { id: 2, name: 'new' };
      act(() => {
        result.current.addPokemon(mockPokemon);
      });

      expect(result.current.slots).toEqual(fullTeam);
    });

    test('should add pokemon to next empty slot', () => {
      const { result } = renderHook(() => useTeamStore());
      const partialTeam = [{ id: 1 }, null, { id: 2 }, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: partialTeam });
      });

      const mockPokemon = {
        id: 3,
        name: 'new',
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'normal' } }],
        stats: [{ base_stat: 50, stat: { name: 'hp' } }],
      };
      act(() => {
        result.current.addPokemon(mockPokemon);
      });

      expect(result.current.slots[1]).toMatchObject({
        id: 3,
        name: 'new',
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'normal' } }],
        stats: [{ base_stat: 50, stat: { name: 'hp' } }],
      });
      expect(result.current.slots[3]).toBeNull();
    });
  });

  describe('removePokemon', () => {
    test('should remove pokemon from specific slot', () => {
      const { result } = renderHook(() => useTeamStore());
      const teamWithPokemon = [{ id: 1 }, null, null, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: teamWithPokemon });
      });

      act(() => {
        result.current.removePokemon(0);
      });

      expect(result.current.slots[0]).toBeNull();
    });

    test('should set isDraft to false when removing last pokemon', () => {
      const { result } = renderHook(() => useTeamStore());
      const teamWithOnePokemon = [{ id: 1 }, null, null, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: teamWithOnePokemon, isDraft: true });
      });

      act(() => {
        result.current.removePokemon(0);
      });

      expect(result.current.isDraft).toBe(false);
    });

    test('should keep isDraft true when other pokemon remain', () => {
      const { result } = renderHook(() => useTeamStore());
      const teamWithMultiplePokemon = [
        { id: 1 },
        { id: 2 },
        null,
        null,
        null,
        null,
      ];

      act(() => {
        useTeamStore.setState({
          slots: teamWithMultiplePokemon,
          isDraft: true,
        });
      });

      act(() => {
        result.current.removePokemon(0);
      });

      expect(result.current.isDraft).toBe(true);
    });
  });

  describe('clearTeam', () => {
    test('should clear all slots', () => {
      const { result } = renderHook(() => useTeamStore());
      const teamWithPokemon = [{ id: 1 }, { id: 2 }, null, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: teamWithPokemon, isDraft: true });
      });

      act(() => {
        result.current.clearTeam();
      });

      expect(result.current.slots).toEqual(Array(6).fill(null));
      expect(result.current.isDraft).toBe(false);
      expect(result.current.currentLoadedTeam).toBeNull();
    });
  });

  describe('reorderTeam', () => {
    test('should reorder team slots', () => {
      const { result } = renderHook(() => useTeamStore());
      const originalTeam = [{ id: 1 }, { id: 2 }, null, null, null, null];
      const newOrder = [null, { id: 1 }, { id: 2 }, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: originalTeam });
      });

      act(() => {
        result.current.reorderTeam(newOrder);
      });

      expect(result.current.slots).toEqual(newOrder);
      expect(result.current.isDraft).toBe(true);
      expect(result.current.currentLoadedTeam).toBeNull();
    });
  });

  describe('randomizeTeam', () => {
    test('should randomize team order', () => {
      const { result } = renderHook(() => useTeamStore());
      const originalTeam = [{ id: 1 }, { id: 2 }, { id: 3 }, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: originalTeam });
      });

      act(() => {
        result.current.randomizeTeam();
      });

      // Should have same pokemon but different order
      const pokemonIds = result.current.slots.filter(Boolean).map((p) => p.id);
      expect(pokemonIds).toContain(1);
      expect(pokemonIds).toContain(2);
      expect(pokemonIds).toContain(3);
      expect(result.current.isDraft).toBe(true);
    });
  });

  describe('sortByAttack', () => {
    test('should sort team by attack stat', () => {
      const { result } = renderHook(() => useTeamStore());
      const teamWithStats = [
        { id: 1, stats: [{ base_stat: 50, stat: { name: 'attack' } }] },
        { id: 2, stats: [{ base_stat: 80, stat: { name: 'attack' } }] },
        { id: 3, stats: [{ base_stat: 30, stat: { name: 'attack' } }] },
        null,
        null,
        null,
      ];

      act(() => {
        useTeamStore.setState({ slots: teamWithStats });
      });

      act(() => {
        result.current.sortByAttack();
      });

      const pokemonIds = result.current.slots.filter(Boolean).map((p) => p.id);
      expect(pokemonIds[0]).toBe(2); // Highest attack
      expect(pokemonIds[1]).toBe(1); // Medium attack
      expect(pokemonIds[2]).toBe(3); // Lowest attack
    });

    test('should handle pokemon without attack stat', () => {
      const { result } = renderHook(() => useTeamStore());
      const teamWithMissingStats = [
        { id: 1, stats: [{ base_stat: 50, stat: { name: 'attack' } }] },
        { id: 2, stats: [{ base_stat: 30, stat: { name: 'defense' } }] },
        null,
        null,
        null,
        null,
      ];

      act(() => {
        useTeamStore.setState({ slots: teamWithMissingStats });
      });

      act(() => {
        result.current.sortByAttack();
      });

      expect(result.current.slots[0].id).toBe(1);
      expect(result.current.slots[1].id).toBe(2);
    });
  });

  describe('saveTeam', () => {
    test('should save team when all slots are filled', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({
        id: 1,
        name: 'test',
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'normal' } }],
        stats: [{ base_stat: 50, stat: { name: 'hp' } }],
      });

      act(() => {
        useTeamStore.setState({ slots: fullTeam });
      });

      let saved;
      act(() => {
        saved = result.current.saveTeam('Test Team');
      });

      expect(saved).toBe(true);
      expect(result.current.savedTeams).toHaveLength(1);
      expect(result.current.savedTeams[0].name).toBe('Test Team');
      expect(result.current.isDraft).toBe(false);
    });

    test('should not save team when slots are not full', () => {
      const { result } = renderHook(() => useTeamStore());
      const incompleteTeam = [
        {
          id: 1,
          name: 'test',
          sprites: { front_default: 'test.png' },
          types: [{ type: { name: 'normal' } }],
          stats: [{ base_stat: 50, stat: { name: 'hp' } }],
        },
        {
          id: 2,
          name: 'test2',
          sprites: { front_default: 'test2.png' },
          types: [{ type: { name: 'normal' } }],
          stats: [{ base_stat: 50, stat: { name: 'hp' } }],
        },
        null,
        null,
        null,
        null,
      ];

      act(() => {
        useTeamStore.setState({ slots: incompleteTeam });
      });

      let saved;
      act(() => {
        saved = result.current.saveTeam('Test Team');
      });

      expect(saved).toBe(false);
      expect(result.current.savedTeams).toHaveLength(0);
    });

    test('should use default name when no name provided', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({ id: 1, name: 'test' });

      act(() => {
        useTeamStore.setState({ slots: fullTeam, savedTeams: [] });
      });

      act(() => {
        result.current.saveTeam();
      });

      expect(result.current.savedTeams[0].name).toBe('Team 1');
    });

    test('should increment team number for default names', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({ id: 1, name: 'test' });
      const existingTeam = { id: 'existing', name: 'Team 1', slots: fullTeam };

      act(() => {
        useTeamStore.setState({ slots: fullTeam, savedTeams: [existingTeam] });
      });

      act(() => {
        result.current.saveTeam();
      });

      expect(result.current.savedTeams[1].name).toBe('Team 2');
    });
  });

  describe('loadTeam', () => {
    test('should load saved team', () => {
      const { result } = renderHook(() => useTeamStore());
      const savedTeam = {
        id: 'test-uuid',
        name: 'Test Team',
        slots: Array(6).fill({ id: 1, name: 'test' }),
        createdAt: Date.now(),
      };

      act(() => {
        result.current.loadTeam(savedTeam);
      });

      expect(result.current.slots).toEqual(savedTeam.slots);
      expect(result.current.currentLoadedTeam).toEqual(savedTeam);
      expect(result.current.isDraft).toBe(false);
    });
  });

  describe('deleteTeam', () => {
    test('should delete team from saved teams', () => {
      const { result } = renderHook(() => useTeamStore());
      const team1 = { id: 'team1', name: 'Team 1', slots: [] };
      const team2 = { id: 'team2', name: 'Team 2', slots: [] };

      act(() => {
        useTeamStore.setState({ savedTeams: [team1, team2] });
      });

      act(() => {
        result.current.deleteTeam('team1');
      });

      expect(result.current.savedTeams).toHaveLength(1);
      expect(result.current.savedTeams[0].id).toBe('team2');
    });

    test('should clear current loaded team if deleted', () => {
      const { result } = renderHook(() => useTeamStore());
      const team = { id: 'team1', name: 'Team 1', slots: [] };

      act(() => {
        useTeamStore.setState({
          savedTeams: [team],
          currentLoadedTeam: team,
        });
      });

      act(() => {
        result.current.deleteTeam('team1');
      });

      expect(result.current.currentLoadedTeam).toBeNull();
    });

    test('should not clear current loaded team if different team deleted', () => {
      const { result } = renderHook(() => useTeamStore());
      const team1 = { id: 'team1', name: 'Team 1', slots: [] };
      const team2 = { id: 'team2', name: 'Team 2', slots: [] };

      act(() => {
        useTeamStore.setState({
          savedTeams: [team1, team2],
          currentLoadedTeam: team1,
        });
      });

      act(() => {
        result.current.deleteTeam('team2');
      });

      expect(result.current.currentLoadedTeam).toEqual(team1);
    });
  });

  describe('clearNotification', () => {
    test('should clear notification', () => {
      const { result } = renderHook(() => useTeamStore());
      const notification = { type: 'success', message: 'Test' };

      act(() => {
        useTeamStore.setState({ notification });
      });

      act(() => {
        result.current.clearNotification();
      });

      expect(result.current.notification).toBeNull();
    });
  });

  describe('isTeamReadyForBattle', () => {
    test('should return true when team is full and loaded', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({ id: 1 });
      const savedTeam = { id: 'test-uuid', name: 'Test Team', slots: fullTeam };

      act(() => {
        useTeamStore.setState({
          slots: fullTeam,
          currentLoadedTeam: savedTeam,
        });
      });

      expect(result.current.isTeamReadyForBattle()).toBe(true);
    });

    test('should return false when team is not full', () => {
      const { result } = renderHook(() => useTeamStore());
      const incompleteTeam = [{ id: 1 }, { id: 2 }, null, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: incompleteTeam });
      });

      expect(result.current.isTeamReadyForBattle()).toBe(false);
    });

    test('should return false when team is not loaded', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({ id: 1 });

      act(() => {
        useTeamStore.setState({ slots: fullTeam, currentLoadedTeam: null });
      });

      expect(result.current.isTeamReadyForBattle()).toBe(false);
    });
  });

  describe('getCurrentTeamForBattle', () => {
    test('should return team data when ready for battle', () => {
      const { result } = renderHook(() => useTeamStore());
      const fullTeam = Array(6).fill({ id: 1, name: 'test' });
      const savedTeam = { id: 'test-uuid', name: 'Test Team', slots: fullTeam };

      act(() => {
        useTeamStore.setState({
          slots: fullTeam,
          currentLoadedTeam: savedTeam,
        });
      });

      const battleTeam = result.current.getCurrentTeamForBattle();
      expect(battleTeam).toEqual({
        id: 'test-uuid',
        name: 'Test Team',
        pokemons: fullTeam,
      });
    });

    test('should return null when team not ready', () => {
      const { result } = renderHook(() => useTeamStore());
      const incompleteTeam = [{ id: 1 }, null, null, null, null, null];

      act(() => {
        useTeamStore.setState({ slots: incompleteTeam });
      });

      expect(result.current.getCurrentTeamForBattle()).toBeNull();
    });
  });
});
