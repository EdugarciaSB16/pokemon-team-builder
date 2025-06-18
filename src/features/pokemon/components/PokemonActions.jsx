import { useTeamStore } from '@/features/team/store';
import { Plus, Info } from 'lucide-react';

export default function PokemonActions({ pokemon }) {
  const addPokemon = useTeamStore((s) => s.addPokemon);
  const slots = useTeamStore((s) => s.slots);
  const isInTeam = slots.some((p) => p?.id === pokemon.id);
  const isTeamFull = slots.filter(Boolean).length >= 6;

  const handleAddToTeam = () => {
    if (!isInTeam && !isTeamFull) {
      addPokemon(pokemon);
    }
  };

  return (
    <div className="flex justify-between gap-2 mt-2">
      <button
        onClick={handleAddToTeam}
        disabled={isInTeam || isTeamFull}
        className={`w-1/2 px-3 py-1.5 text-xs font-bold rounded-lg border-2 shadow-md transition-all duration-200 flex items-center justify-center ${
          isInTeam
            ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed'
            : isTeamFull
            ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-gray-900 border-yellow-700 hover:from-yellow-500 hover:to-yellow-700 active:translate-y-0.5'
        }`}
        title={
          isInTeam
            ? 'Already in team'
            : isTeamFull
            ? 'Team is full (max 6)'
            : 'Add to team'
        }
      >
        <Plus size={14} className="mr-1" />
        Add
      </button>

      <button
        className="w-1/2 px-3 py-1.5 text-xs font-bold bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-lg border-2 border-blue-700 shadow-md hover:from-blue-500 hover:to-blue-700 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center"
        title="View details"
      >
        <Info size={14} className="mr-1" />
        Details
      </button>
    </div>
  );
}
