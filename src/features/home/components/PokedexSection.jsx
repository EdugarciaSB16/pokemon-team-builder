import React from 'react';
import { useState, useCallback } from 'react';
import PokemonList from '@/features/pokemon/components/PokemonList';
import PokemonFilters from '@/features/pokemon/components/PokemonFilters';

export default function PokedexSection() {
  const [filters, setFilters] = useState({ searchTerm: '', types: [] });

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <section>
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border-4 border-red-500 shadow-lg">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">POKÉDEX</h2>
          <PokemonFilters onFiltersChange={handleFiltersChange} />
        </div>
        <PokemonList filters={filters} />
      </div>
    </section>
  );
}
