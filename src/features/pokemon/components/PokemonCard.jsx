import { useState } from 'react';
import PokemonImage from './PokemonImage';
import PokemonTypes from './PokemonTypes';
import PokemonStats from './PokemonStats';
import PokemonActions from './PokemonActions';

const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-600',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-800',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonCard({ pokemon }) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const bgColor = typeColors[primaryType] || 'bg-gray-200';

  const getPokemonImage = () => {
    return (
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '/pokeball.png'
    );
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${bgColor}/20 h-full flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 opacity-20 ${bgColor} transition-opacity duration-300 ${
          isHovered ? 'opacity-30' : ''
        }`}
      ></div>

      <div className="relative z-10 pt-20 pb-3 px-3 text-center flex-1 flex flex-col">
        <PokemonImage
          src={getPokemonImage()}
          alt={pokemon.name}
          hovered={isHovered}
        />

        <div className="absolute top-2 left-2 bg-black/20 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>

        <h3 className="text-sm font-bold text-gray-800 capitalize mb-1 mt-2">
          {pokemon.name}
        </h3>

        <PokemonTypes types={pokemon.types} />
        <PokemonStats stats={pokemon.stats} />
        <PokemonActions pokemon={pokemon} />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : ''
        }`}
      ></div>
    </div>
  );
}
