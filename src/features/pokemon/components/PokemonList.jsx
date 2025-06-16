import { useCallback, useEffect, useRef, useState } from 'react';

// Simple throttle function
function throttle(callback, limit) {
  let waiting = false;
  return function() {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}
import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
import PokemonCard from './PokemonCard';

export default function PokemonList() {
  const [displayCount, setDisplayCount] = useState(30);
  const { data: pokemons = [], isLoading, isError } = usePokemonList(displayCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollPosition = useRef(0);
  const prevPokemonsLength = useRef(0);

  // Save scroll position before new items are loaded
  const saveScrollPosition = () => {
    scrollPosition.current = window.scrollY;
  };

  // Restore scroll position after new items are loaded
  const restoreScrollPosition = useCallback(() => {
    if (pokemons.length > prevPokemonsLength.current) {
      window.scrollTo(0, scrollPosition.current);
    }
    prevPokemonsLength.current = pokemons.length;
  }, [pokemons.length]);

  // Reset loading state when data changes
  useEffect(() => {
    if (pokemons.length > 0) {
      // Small delay to ensure the DOM has updated
      const timer = setTimeout(() => {
        setIsLoadingMore(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pokemons]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      const scrollThreshold = 200; // pixels from bottom
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight - scrollThreshold;
      
      if (
        scrollPosition >= bottomPosition &&
        !isLoading &&
        !isLoadingMore &&
        Array.isArray(pokemons) &&
        pokemons.length > 0
      ) {
        saveScrollPosition();
        setDisplayCount((prev) => prev + 30);
        setIsLoadingMore(true);
      }
    };

    // Add throttle to scroll event
    const throttledScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledScroll);
    
    // Initial check in case the content doesn't fill the viewport
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [isLoading, isLoadingMore, pokemons]);

  // Restore scroll position after new data is loaded
  useEffect(() => {
    if (!isLoading && !isLoadingMore) {
      // Small delay to ensure the DOM has updated with new items
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isLoadingMore, restoreScrollPosition]);

  // Show loading state
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

  // Show error state
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

  // Show empty state
  if (!Array.isArray(pokemons) || pokemons.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="inline-block p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
          <p>No Pokémon found.</p>
          <p className="text-xs mt-2">Try a different search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
        {pokemons.map((pokemon) => (
          pokemon && pokemon.id ? (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ) : null
        ))}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
        </div>
      )}
    </div>
  );
}
