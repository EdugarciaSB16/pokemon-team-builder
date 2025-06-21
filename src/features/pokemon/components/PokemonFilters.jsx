import React from 'react';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

const TYPE_COLORS = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-blue-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-600',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-purple-600',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonFilters({ onFiltersChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    onFiltersChange({
      searchTerm: debouncedSearch,
      types: selectedTypes,
    });
  }, [debouncedSearch, selectedTypes, onFiltersChange]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Pokémon..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-yellow-400 focus:outline-none"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-700">Filter by Type</h3>
          {(selectedTypes.length > 0 || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <X size={16} className="mr-1" />
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedTypes.includes(type)
                  ? `${TYPE_COLORS[type]} text-white ring-2 ring-offset-2 ring-gray-700`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
