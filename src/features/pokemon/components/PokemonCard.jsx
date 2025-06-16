import { useTeamStore } from '@/features/team/store';

export default function PokemonCard({ pokemon }) {
  const addPokemon = useTeamStore((s) => s.addPokemon);

  return (
    <div className="relative bg-white rounded-xl shadow-md pt-12 pb-4 px-3 w-40 text-center">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img
          src={pokemon.gif}
          alt={pokemon.name}
          className="w-20 h-20 object-contain"
        />
      </div>

      <p className="capitalize text-sm font-bold mt-1">{pokemon.name}</p>

      <div className="flex justify-center gap-2 mt-3">
        <button
          onClick={() => addPokemon(pokemon)}
          className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
        >
          ADD
        </button>
        <button className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">
          DETAIL
        </button>
      </div>
    </div>
  );
}
