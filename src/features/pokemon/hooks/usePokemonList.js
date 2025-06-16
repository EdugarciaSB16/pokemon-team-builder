import { useQuery } from '@tanstack/react-query';

export function usePokemonList(limit = 30) {
  return useQuery({
    queryKey: ['pokemonList', limit],
    queryFn: async () => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
      );
      const data = await res.json();

      const details = await Promise.all(
        data.results.map(async (p) => {
          const resDetail = await fetch(p.url);
          const detail = await resDetail.json();

          return {
            id: detail.id,
            name: detail.name,
            gif: detail.sprites.other.showdown.front_default,
            stats: detail.stats,
            sprites: detail.sprites,
            types: detail.types,
          };
        })
      );

      return details;
    },
  });
}
