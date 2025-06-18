import { useEffect, useRef } from 'react';
import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
import PokemonCard from './PokemonCard';

export default function PokemonList({ filters }) {
  const {
    data: pokemons = [],
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePokemonList(filters);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && (!pokemons || pokemons.length === 0)) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <div className="inline-block p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>Oh no! A wild error appeared!</p>
          <p className="text-xs mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(pokemons) || pokemons.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="inline-block p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
          <p>No Pokémon found.</p>
          <p className="text-xs mt-2">Try different filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
        {pokemons.map((pokemon) =>
          pokemon && pokemon.id ? (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ) : null
        )}
      </div>

      {/* Intersection Observer Target */}
      <div
        ref={observerTarget}
        className="h-10 w-full flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
        )}
      </div>
    </div>
  );
}
