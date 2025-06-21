import React from 'react';
import { Heart, Target, Shield as ShieldIcon, Zap } from 'lucide-react';
import PokemonImage from '@/features/pokemon/components/PokemonImage';

export default function BattleArena({
  pokeA,
  pokeB,
  battleState,
  getPokemonImage,
  getPokemonStats,
}) {
  const statsA = getPokemonStats(pokeA);
  const statsB = getPokemonStats(pokeB);

  return (
    <div className="relative flex flex-col lg:block bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-2xl p-4 md:p-8 mb-8 min-h-[600px] overflow-hidden border-4 border-green-200">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-200/20"></div>
      <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400/20 rounded-full"></div>
      <div className="absolute top-8 right-8 w-12 h-12 bg-blue-400/20 rounded-full"></div>
      <div className="absolute bottom-8 left-8 w-20 h-20 bg-red-400/20 rounded-full"></div>
      <div className="relative lg:absolute lg:top-8 lg:right-8 w-full lg:w-80 mx-auto order-1">
        {pokeB && (
          <div
            className={`transition-all duration-500 mx-auto w-full max-w-sm lg:max-w-none ${
              battleState.currentAnimation === 'attack' &&
              battleState.battleText.includes(pokeB.name)
                ? 'lg:-translate-x-16'
                : ''
            }`}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 md:p-4 mb-4 shadow-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg capitalize text-blue-700">
                  {pokeB.name}
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Lv. 50
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">HP</span>
                  <span className="text-sm font-bold">
                    {battleState.pokemonBHP}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg"
                    style={{ width: `${battleState.pokemonBHP}%` }}
                  />
                </div>
              </div>
              {statsB && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-red-500" />
                    <span className="font-medium">HP:</span>
                    <span className="text-gray-600">{statsB.hp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={12} className="text-orange-500" />
                    <span className="font-medium">ATK:</span>
                    <span className="text-gray-600">{statsB.attack}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldIcon size={12} className="text-blue-500" />
                    <span className="font-medium">DEF:</span>
                    <span className="text-gray-600">{statsB.defense}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-yellow-500" />
                    <span className="font-medium">SPD:</span>
                    <span className="text-gray-600">{statsB.speed}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-50"></div>
              <PokemonImage
                src={getPokemonImage(pokeB)}
                alt={pokeB.name}
                className={`w-full h-full object-contain transition-all duration-300 ${
                  battleState.currentAnimation === 'damage' &&
                  battleState.battleText.includes(pokeB.name)
                    ? 'animate-shake scale-110'
                    : ''
                }`}
              />
            </div>
          </div>
        )}
      </div>
      <div className="relative lg:absolute lg:bottom-8 lg:left-8 w-full lg:w-80 mx-auto order-3 lg:order-2">
        {pokeA && (
          <div
            className={`transition-all duration-500 mx-auto w-full max-w-sm lg:max-w-none ${
              battleState.currentAnimation === 'attack' &&
              battleState.battleText.includes(pokeA.name)
                ? 'lg:translate-x-16'
                : ''
            }`}
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-50"></div>
              <PokemonImage
                src={getPokemonImage(pokeA)}
                alt={pokeA.name}
                className={`w-full h-full object-contain transform scale-x-[-1] transition-all duration-300 ${
                  battleState.currentAnimation === 'damage' &&
                  battleState.battleText.includes(pokeA.name)
                    ? 'animate-shake scale-110'
                    : ''
                }`}
              />
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 md:p-4 mt-4 shadow-xl border-2 border-red-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg capitalize text-red-700">
                  {pokeA.name}
                </span>
                <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  Lv. 50
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">HP</span>
                  <span className="text-sm font-bold">
                    {battleState.pokemonAHP}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg"
                    style={{ width: `${battleState.pokemonAHP}%` }}
                  />
                </div>
              </div>
              {statsA && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-red-500" />
                    <span className="font-medium">HP:</span>
                    <span className="text-gray-600">{statsA.hp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={12} className="text-orange-500" />
                    <span className="font-medium">ATK:</span>
                    <span className="text-gray-600">{statsA.attack}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldIcon size={12} className="text-blue-500" />
                    <span className="font-medium">DEF:</span>
                    <span className="text-gray-600">{statsA.defense}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-yellow-500" />
                    <span className="font-medium">SPD:</span>
                    <span className="text-gray-600">{statsA.speed}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative lg:absolute lg:bottom-8 left-0 right-0 mx-auto w-full max-w-lg lg:w-[600px] order-2 lg:order-3 my-4 lg:my-0">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl border-2 border-gray-200">
          <p className="text-lg md:text-xl font-bold text-gray-800 text-center">
            {battleState.battleText}
          </p>
        </div>
      </div>
    </div>
  );
}
