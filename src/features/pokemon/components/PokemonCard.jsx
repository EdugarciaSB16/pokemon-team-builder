import { useState } from 'react';
import { useTeamStore } from '@/features/team/store';

// Pokémon type colors
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
  const [isAdded, setIsAdded] = useState(false);
  const addPokemon = useTeamStore((s) => s.addPokemon);
  const team = useTeamStore((s) => s.team);
  
  // Check if this Pokémon is already in the team
  const isInTeam = team.some(p => p?.id === pokemon.id);
  const isTeamFull = team.length >= 6;

  const handleAddToTeam = () => {
    if (isTeamFull || isInTeam) return;
    
    addPokemon(pokemon);
    setIsAdded(true);
    
    // Reset the added state after animation
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Get the primary type for the card styling
  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const bgColor = typeColors[primaryType] || 'bg-gray-200';

  // Get the best available image
  const getPokemonImage = () => {
    return (
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '/pokeball.png' // Fallback image
    );
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${bgColor}/20 h-full flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <div className={`absolute inset-0 opacity-20 ${bgColor} transition-opacity duration-300 ${isHovered ? 'opacity-30' : ''}`}></div>
      
      {/* Pokémon image with floating animation */}
      <div className="relative z-10 pt-20 pb-3 px-3 text-center flex-1 flex flex-col">
        <div className={`relative h-32 flex items-center justify-center transition-transform duration-300 ${isHovered ? '-translate-y-2' : ''}`}>
          <img
            src={getPokemonImage()}
            alt={pokemon.name}
            className={`max-h-full max-w-full object-contain transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/pokeball.png';
            }}
          />
        </div>

        {/* Pokémon ID */}
        <div className="absolute top-2 left-2 bg-black/20 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>

        {/* Pokémon Name */}
        <h3 className="text-sm font-bold text-gray-800 capitalize mb-1 mt-2">
          {pokemon.name}
        </h3>

        {/* Pokémon Types */}
        <div className="flex justify-center gap-1.5 mb-3">
          {pokemon.types?.map((type, index) => (
            <span 
              key={index}
              className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${typeColors[type.type.name] || 'bg-gray-400'}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-3">
          {pokemon.stats?.slice(0, 4).map((stat, index) => (
            <div key={index} className="text-left">
              <div className="flex justify-between mb-0.5">
                <span className="text-gray-600 font-medium">{stat.stat.name}</span>
                <span className="font-bold">{stat.base_stat}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-full rounded-full ${stat.base_stat > 70 ? 'bg-green-500' : stat.base_stat > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (stat.base_stat / 150) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={handleAddToTeam}
            disabled={isInTeam || isTeamFull}
            className={`relative px-3 py-1.5 text-xs font-bold rounded-lg shadow-md transition-all duration-200 flex-1 flex items-center justify-center overflow-hidden ${
              isInTeam 
                ? 'bg-green-100 text-green-800 border border-green-300 cursor-not-allowed'
                : isTeamFull 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 active:translate-y-0.5'
            }`}
            title={isInTeam ? 'Already in team' : isTeamFull ? 'Team is full (max 6)' : 'Add to team'}
          >
            {isInTeam ? (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                In Team
              </span>
            ) : isTeamFull ? (
              'Team Full'
            ) : (
              <>
                <span className={`transition-all duration-300 ${isAdded ? '-translate-y-6' : 'translate-y-0'}`}>
                  Add to Team
                </span>
                <span className={`absolute transition-all duration-300 ${isAdded ? 'translate-y-0' : 'translate-y-6'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </>
            )}
          </button>
          
          <button 
            className="px-3 py-1.5 text-xs font-bold bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 rounded-lg shadow-md hover:from-blue-200 hover:to-blue-300 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            title="View details"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </button>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : ''
      }`}></div>
    </div>
  );
}
