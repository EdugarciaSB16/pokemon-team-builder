import PokemonTypes from '@/features/pokemon/components/PokemonTypes';

export default function TeamSlotContent({
  pokemon,
  onRemove,
  cardSize = 'normal',
}) {
  if (cardSize === 'large') {
    const atk = pokemon.stats?.find((s) => s.stat.name === 'attack')?.base_stat;
    const def = pokemon.stats?.find(
      (s) => s.stat.name === 'defense'
    )?.base_stat;
    const spd = pokemon.stats?.find((s) => s.stat.name === 'speed')?.base_stat;
    return (
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-2 transition-all duration-300">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain drop-shadow-md"
        />
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-3 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-sm rounded-full hover:bg-red-600 shadow-lg border-2 border-white transition-colors"
            title="Remove"
          >
            ×
          </button>
        )}
        <div className="relative w-24 h-24 flex items-center justify-center mb-2"></div>
        <div className="w-full px-2 py-1 bg-black/70 rounded-md text-center mb-1">
          <p className="text-base font-bold text-white capitalize truncate">
            {pokemon.name}
          </p>
        </div>
        <PokemonTypes types={pokemon.types} />
        <div className="flex justify-center gap-2 mt-1 text-xs">
          <span className="bg-gray-800 text-yellow-300 px-2 py-0.5 rounded font-bold">
            ATK {atk}
          </span>
          <span className="bg-gray-800 text-blue-300 px-2 py-0.5 rounded font-bold">
            DEF {def}
          </span>
          <span className="bg-gray-800 text-pink-300 px-2 py-0.5 rounded font-bold">
            SPD {spd}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-2 transition-all duration-300">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain drop-shadow-md"
        />
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-sm rounded-full hover:bg-red-600 shadow-lg border-2 border-white transition-colors"
            title="Remove"
          >
            ×
          </button>
        )}
      </div>
      <div className="w-full px-2 py-1 bg-black/70 rounded-md text-center">
        <p className="text-sm font-bold text-white capitalize truncate">
          {pokemon.name}
        </p>
      </div>
    </div>
  );
}
