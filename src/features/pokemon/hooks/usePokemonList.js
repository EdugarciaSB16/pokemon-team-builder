import { useInfiniteQuery } from '@tanstack/react-query';

const POKEMON_PER_PAGE = 30;
const TOTAL_POKEMON = 1008;

async function fetchAllPokemonNames() {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
  );
  const data = await response.json();
  return data.results;
}

async function fetchFilteredPokemon({
  pageParam = 0,
  searchTerm = '',
  types = [],
}) {
  try {
    if (searchTerm) {
      const allPokemon = await fetchAllPokemonNames();

      const matchingPokemon = allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const paginatedUrls = matchingPokemon.slice(
        pageParam * POKEMON_PER_PAGE,
        (pageParam + 1) * POKEMON_PER_PAGE
      );

      const pokemonDetails = await Promise.all(
        paginatedUrls.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      const filteredPokemon =
        types.length > 0
          ? pokemonDetails.filter((pokemon) =>
              types.every((type) =>
                pokemon.types.some((t) => t.type.name === type)
              )
            )
          : pokemonDetails;

      return {
        pokemon: filteredPokemon,
        nextPage:
          (pageParam + 1) * POKEMON_PER_PAGE < matchingPokemon.length
            ? pageParam + 1
            : undefined,
        total: matchingPokemon.length,
      };
    }

    if (types.length > 0) {
      const typePromises = types.map((type) =>
        fetch(`https://pokeapi.co/api/v2/type/${type}`)
          .then((res) => res.json())
          .then((data) => data.pokemon.map((p) => p.pokemon))
      );

      const typeResults = await Promise.all(typePromises);

      const commonPokemon = typeResults.reduce((common, current) => {
        if (common.length === 0) return current;
        return common.filter((pokemon) =>
          current.some((p) => p.url === pokemon.url)
        );
      }, []);

      const paginatedUrls = commonPokemon.slice(
        pageParam * POKEMON_PER_PAGE,
        (pageParam + 1) * POKEMON_PER_PAGE
      );

      const pokemonDetails = await Promise.all(
        paginatedUrls.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      return {
        pokemon: pokemonDetails,
        nextPage:
          (pageParam + 1) * POKEMON_PER_PAGE < commonPokemon.length
            ? pageParam + 1
            : undefined,
        total: commonPokemon.length,
      };
    }

    const offset = pageParam * POKEMON_PER_PAGE;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${POKEMON_PER_PAGE}`
    );
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );

    return {
      pokemon: pokemonDetails,
      nextPage:
        offset + POKEMON_PER_PAGE < data.count ? pageParam + 1 : undefined,
      total: data.count,
    };
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    throw error;
  }
}

export function usePokemonList(filters = { searchTerm: '', types: [] }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['pokemons', filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchFilteredPokemon({
        pageParam,
        searchTerm: filters.searchTerm,
        types: filters.types,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const flattenedData = data?.pages.flatMap((page) => page.pokemon) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

  return {
    data: flattenedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    totalCount,
    refetch,
  };
}
