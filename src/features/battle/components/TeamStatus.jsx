import React from 'react';
import { Users } from 'lucide-react';
import PokemonImage from '@/features/pokemon/components/PokemonImage';

export default function TeamStatus({
  team,
  teamName,
  faintedPokemon,
  getPokemonImage,
  getPokemonStats,
  teamColor = 'red',
}) {
  const colorClasses = {
    red: {
      container:
        'bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-red-200',
      title: 'text-xl font-bold mb-4 text-red-600',
      iconBg: 'bg-red-100 p-2 rounded-lg',
      icon: 'text-red-600',
      pokemonContainer: (isFainted) =>
        isFainted
          ? 'bg-red-50 border-2 border-red-300 opacity-60'
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
      statusText: (isFainted) =>
        isFainted ? 'text-red-600 font-bold' : 'text-green-600 font-bold',
      statusIcon: (isFainted) => (isFainted ? '✗ FAINTED' : '✓ ACTIVE'),
    },
    blue: {
      container:
        'bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-blue-200',
      title: 'text-xl font-bold mb-4 text-blue-600',
      iconBg: 'bg-blue-100 p-2 rounded-lg',
      icon: 'text-blue-600',
      pokemonContainer: (isFainted) =>
        isFainted
          ? 'bg-blue-50 border-2 border-blue-300 opacity-60'
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
      statusText: (isFainted) =>
        isFainted ? 'text-red-600 font-bold' : 'text-green-600 font-bold',
      statusIcon: (isFainted) => (isFainted ? '✗ FAINTED' : '✓ ACTIVE'),
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <div className={colors.container}>
      <h2 className={colors.title}>
        <div className={colors.iconBg}>
          <Users size={24} className={colors.icon} />
        </div>
        {teamName}
      </h2>
      <div className="space-y-3">
        {team.map((pokemon, index) => {
          const stats = getPokemonStats(pokemon);
          const isFainted = faintedPokemon.has(index);

          return (
            <div
              key={index}
              className={`p-3 rounded-lg transition-all duration-200 ${colors.pokemonContainer(
                isFainted
              )}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                  <PokemonImage
                    src={getPokemonImage(pokemon)}
                    alt={pokemon.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-bold capitalize text-gray-800">
                    {pokemon.name}
                  </span>
                  <span className={`ml-2 ${colors.statusText(isFainted)}`}>
                    {colors.statusIcon(isFainted)}
                  </span>
                </div>
              </div>
              {stats && (
                <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
                  <div>HP: {stats.hp}</div>
                  <div>ATK: {stats.attack}</div>
                  <div>SPD: {stats.speed}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
