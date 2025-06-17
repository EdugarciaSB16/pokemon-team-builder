import { useTeamStore } from '@/features/team/store';

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
        title={
          isInTeam
            ? 'Already in team'
            : isTeamFull
            ? 'Team is full (max 6)'
            : 'Add to team'
        }
      >
        Add
      </button>

      <button
        className="px-3 py-1.5 text-xs font-bold bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 rounded-lg shadow-md hover:from-blue-200 hover:to-blue-300 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center"
        title="View details"
      >
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Details
      </button>
    </div>
  );
}
