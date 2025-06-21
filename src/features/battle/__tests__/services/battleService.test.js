import { BattleService } from '../../services/battleService';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  removeItem: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('BattleService', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('generateRandomTeamFromAPI', () => {
    test('should generate random team successfully', async () => {
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

      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await BattleService.generateRandomTeamFromAPI();

      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default: 'test.png',
          other: { 'official-artwork': { front_default: 'art.png' } },
        },
        types: [{ type: { name: 'grass' } }],
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      });
    });

    test('should generate unique random IDs', async () => {
      const mockPokemon = {
        id: 1,
        name: 'test',
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'normal' } }],
        stats: [{ base_stat: 50, stat: { name: 'hp' } }],
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await BattleService.generateRandomTeamFromAPI();

      expect(result).toHaveLength(6);

      // Check that fetch was called 6 times with different IDs
      expect(fetch).toHaveBeenCalledTimes(6);

      // Get all the IDs that were fetched
      const calledUrls = fetch.mock.calls.map((call) => call[0]);
      const ids = calledUrls.map((url) => {
        const match = url.match(/pokemon\/(\d+)/);
        return match ? parseInt(match[1]) : null;
      });

      // Check that all IDs are unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(6);
    });

    test('should handle API error', async () => {
      fetch.mockResolvedValue({
        ok: false,
      });

      await expect(BattleService.generateRandomTeamFromAPI()).rejects.toThrow(
        'Failed to fetch Pokemon'
      );
    });

    test('should handle network error', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(BattleService.generateRandomTeamFromAPI()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getPokemonStats', () => {
    test('should return correct stat value', () => {
      const pokemon = {
        stats: [
          { base_stat: 45, stat: { name: 'hp' } },
          { base_stat: 60, stat: { name: 'attack' } },
          { base_stat: 48, stat: { name: 'defense' } },
        ],
      };

      expect(BattleService.getPokemonStats(pokemon, 'attack')).toBe(60);
      expect(BattleService.getPokemonStats(pokemon, 'defense')).toBe(48);
      expect(BattleService.getPokemonStats(pokemon, 'hp')).toBe(45);
    });

    test('should return 0 for non-existent stat', () => {
      const pokemon = {
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      };

      expect(BattleService.getPokemonStats(pokemon, 'nonexistent')).toBe(0);
    });

    test('should handle pokemon with no stats', () => {
      const pokemon = { stats: [] };

      expect(BattleService.getPokemonStats(pokemon, 'attack')).toBe(0);
    });

    test('should handle undefined pokemon', () => {
      expect(BattleService.getPokemonStats(undefined, 'attack')).toBe(0);
    });
  });

  describe('simulateFullBattle', () => {
    test('should simulate battle correctly with different stats', () => {
      const team1 = [
        {
          name: 'pokemon1',
          stats: [
            { base_stat: 100, stat: { name: 'attack' } },
            { base_stat: 50, stat: { name: 'defense' } },
            { base_stat: 80, stat: { name: 'speed' } },
          ],
        },
      ];

      const team2 = [
        {
          name: 'pokemon2',
          stats: [
            { base_stat: 80, stat: { name: 'attack' } },
            { base_stat: 60, stat: { name: 'defense' } },
            { base_stat: 70, stat: { name: 'speed' } },
          ],
        },
      ];

      const result = BattleService.simulateFullBattle(team1, team2);

      expect(result).toHaveProperty('rounds');
      expect(result).toHaveProperty('survivorsA');
      expect(result).toHaveProperty('survivorsB');
      expect(result).toHaveProperty('defeatedA');
      expect(result).toHaveProperty('defeatedB');
      expect(result.rounds).toHaveLength(1);
      expect(result.rounds[0]).toHaveProperty('pokemonA');
      expect(result.rounds[0]).toHaveProperty('pokemonB');
      expect(result.rounds[0]).toHaveProperty('winner');
      expect(result.rounds[0]).toHaveProperty('message');
    });

    test('should handle battle with multiple pokemon', () => {
      const team1 = [
        {
          name: 'pokemon1',
          stats: [
            { base_stat: 50, stat: { name: 'attack' } },
            { base_stat: 50, stat: { name: 'defense' } },
            { base_stat: 50, stat: { name: 'speed' } },
          ],
        },
        {
          name: 'pokemon2',
          stats: [
            { base_stat: 60, stat: { name: 'attack' } },
            { base_stat: 60, stat: { name: 'defense' } },
            { base_stat: 60, stat: { name: 'speed' } },
          ],
        },
      ];

      const team2 = [
        {
          name: 'enemy1',
          stats: [
            { base_stat: 40, stat: { name: 'attack' } },
            { base_stat: 40, stat: { name: 'defense' } },
            { base_stat: 40, stat: { name: 'speed' } },
          ],
        },
        {
          name: 'enemy2',
          stats: [
            { base_stat: 70, stat: { name: 'attack' } },
            { base_stat: 70, stat: { name: 'defense' } },
            { base_stat: 70, stat: { name: 'speed' } },
          ],
        },
      ];

      const result = BattleService.simulateFullBattle(team1, team2);

      expect(result.rounds.length).toBeGreaterThan(1);
      expect(result.survivorsA).toBeGreaterThanOrEqual(0);
      expect(result.survivorsB).toBeGreaterThanOrEqual(0);
    });

    test('should handle battle with equal stats', () => {
      const team1 = [
        {
          name: 'pokemon1',
          stats: [
            { base_stat: 50, stat: { name: 'attack' } },
            { base_stat: 50, stat: { name: 'defense' } },
            { base_stat: 50, stat: { name: 'speed' } },
          ],
        },
      ];

      const team2 = [
        {
          name: 'pokemon2',
          stats: [
            { base_stat: 50, stat: { name: 'attack' } },
            { base_stat: 50, stat: { name: 'defense' } },
            { base_stat: 50, stat: { name: 'speed' } },
          ],
        },
      ];

      const result = BattleService.simulateFullBattle(team1, team2);

      expect(result.rounds).toHaveLength(1);
      expect(result.rounds[0].winner).toBeDefined();
      expect(result.rounds[0].message).toContain('higher speed');
    });

    test('should handle battle with missing stats', () => {
      const team1 = [
        {
          name: 'pokemon1',
          stats: [
            { base_stat: 50, stat: { name: 'attack' } },
            { base_stat: 50, stat: { name: 'defense' } },
          ],
        },
      ];

      const team2 = [
        {
          name: 'pokemon2',
          stats: [
            { base_stat: 60, stat: { name: 'attack' } },
            { base_stat: 60, stat: { name: 'defense' } },
          ],
        },
      ];

      const result = BattleService.simulateFullBattle(team1, team2);

      expect(result.rounds).toHaveLength(1);
      expect(result.rounds[0].winner).toBeDefined();
    });

    test('should handle empty teams', () => {
      const result = BattleService.simulateFullBattle([], []);

      expect(result.rounds).toHaveLength(0);
      expect(result.survivorsA).toBe(0);
      expect(result.survivorsB).toBe(0);
    });

    test('should handle one empty team', () => {
      const team1 = [
        {
          name: 'pokemon1',
          stats: [
            { base_stat: 50, stat: { name: 'attack' } },
            { base_stat: 50, stat: { name: 'defense' } },
            { base_stat: 50, stat: { name: 'speed' } },
          ],
        },
      ];

      const result = BattleService.simulateFullBattle(team1, []);

      expect(result.rounds).toHaveLength(0);
      expect(result.survivorsA).toBe(1);
      expect(result.survivorsB).toBe(0);
    });
  });

  describe('calculateFinalResults', () => {
    test('should calculate results correctly', () => {
      const battleResults = [
        { winner: 'Team 1' },
        { winner: 'Team 1' },
        { winner: 'Team 2' },
        { winner: 'Team 1' },
      ];

      const team1 = [{ name: 'pokemon1' }, { name: 'pokemon2' }];
      const team2 = [{ name: 'enemy1' }, { name: 'enemy2' }];

      const result = BattleService.calculateFinalResults(
        battleResults,
        team1,
        team2
      );

      expect(result.team1Wins).toBe(3);
      expect(result.team2Wins).toBe(1);
      expect(result.team1Survivors).toBe(1);
      expect(result.team2Survivors).toBe(0);
      expect(result.winner).toBe('Team 1');
    });

    test('should handle tie', () => {
      const battleResults = [{ winner: 'Team 1' }, { winner: 'Team 2' }];

      const team1 = [{ name: 'pokemon1' }];
      const team2 = [{ name: 'enemy1' }];

      const result = BattleService.calculateFinalResults(
        battleResults,
        team1,
        team2
      );

      expect(result.team1Wins).toBe(1);
      expect(result.team2Wins).toBe(1);
      expect(result.winner).toBe('Tie');
    });

    test('should handle no survivors', () => {
      const battleResults = [{ winner: 'Team 1' }, { winner: 'Team 1' }];

      const team1 = [{ name: 'pokemon1' }, { name: 'pokemon2' }];
      const team2 = [{ name: 'enemy1' }, { name: 'enemy2' }];

      const result = BattleService.calculateFinalResults(
        battleResults,
        team1,
        team2
      );

      expect(result.team1Survivors).toBe(2);
      expect(result.team2Survivors).toBe(0);
    });
  });
});
