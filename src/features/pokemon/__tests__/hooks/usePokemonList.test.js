import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePokemonList } from '../../hooks/usePokemonList';

global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePokemonList', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch pokemon list successfully', async () => {
    const mockPokemonData = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
      count: 2,
    };

    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemonData),
    });

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemonDetails),
    });
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({ ...mockPokemonDetails, id: 2, name: 'ivysaur' }),
    });

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('bulbasaur');
    expect(result.current.data[1].name).toBe('ivysaur');
    expect(result.current.totalCount).toBe(2);
  });

  test('should handle search term filtering', async () => {
    const mockAllPokemon = {
      results: Array.from({ length: 1008 }, (_, i) => ({
        name: `pokemon${i}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
      })),
    };

    const mockPokemonDetails = {
      id: 1,
      name: 'pokemon1',
      types: [{ type: { name: 'normal' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    };

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockAllPokemon),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails),
      });

    const { result } = renderHook(
      () => usePokemonList({ searchTerm: 'pokemon1' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=1008'
    );
  });

  test('should handle type filtering', async () => {
    const mockTypeData = {
      pokemon: [
        {
          pokemon: {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        },
        {
          pokemon: {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/',
          },
        },
      ],
    };

    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    };

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTypeData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails),
      });

    const { result } = renderHook(() => usePokemonList({ types: ['grass'] }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/grass');
  });

  test('should handle multiple type filtering', async () => {
    const mockTypeData1 = {
      pokemon: [
        {
          pokemon: {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        },
        {
          pokemon: {
            name: 'charmander',
            url: 'https://pokeapi.co/api/v2/pokemon/4/',
          },
        },
      ],
    };

    const mockTypeData2 = {
      pokemon: [
        {
          pokemon: {
            name: 'charmander',
            url: 'https://pokeapi.co/api/v2/pokemon/4/',
          },
        },
        {
          pokemon: {
            name: 'squirtle',
            url: 'https://pokeapi.co/api/v2/pokemon/7/',
          },
        },
      ],
    };

    const mockPokemonDetails = {
      id: 4,
      name: 'charmander',
      types: [{ type: { name: 'fire' } }],
      stats: [{ base_stat: 39, stat: { name: 'hp' } }],
    };

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTypeData1),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTypeData2),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails),
      });

    const { result } = renderHook(
      () => usePokemonList({ types: ['grass', 'fire'] }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/grass');
    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire');
  });

  test('should handle search and type filtering together', async () => {
    const mockAllPokemon = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    };

    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    };

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockAllPokemon),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails),
      });

    const { result } = renderHook(
      () => usePokemonList({ searchTerm: 'bulba', types: ['grass'] }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=1008'
    );
  });

  test('should handle error state', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test('should handle pagination correctly', async () => {
    const mockFirstPage = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
      count: 1008,
    };

    const mockSecondPage = {
      results: [
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
      count: 1008,
    };

    const mockPokemonDetails = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      { id: 3, name: 'venusaur' },
      { id: 4, name: 'charmander' },
    ];

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockFirstPage),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails[0]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails[1]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockSecondPage),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails[2]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails[3]),
      });

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);

    // Fetch next page
    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    expect(result.current.data).toHaveLength(4);
  });

  test('should handle empty search results', async () => {
    const mockEmptyResults = {
      results: [],
      count: 0,
    };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockEmptyResults),
    });

    const { result } = renderHook(
      () => usePokemonList({ searchTerm: 'nonexistent' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });

  test('should handle API response with missing data', async () => {
    const mockIncompleteData = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
      count: 1,
    };

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockIncompleteData),
      })
      .mockRejectedValueOnce(new Error('Pokemon not found'));

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test('should handle refetch functionality', async () => {
    const mockData = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
      count: 1,
    };

    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    };

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonDetails),
      });

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Trigger refetch
    await result.current.refetch();

    // Should have 4 calls: initial fetch + pokemon details + refetch + pokemon details
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  test('should handle default filters', () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });

  test('should handle custom filters', () => {
    const { result } = renderHook(
      () => usePokemonList({ searchTerm: 'test', types: ['fire'] }),
      { wrapper: createWrapper() }
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });
});
