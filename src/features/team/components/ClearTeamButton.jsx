import { useTeamStore } from '@/features/team/store';
import { Trash2 } from 'lucide-react';

export default function ClearTeamButton() {
  const slots = useTeamStore((s) => s.slots);
  const clearTeam = useTeamStore((s) => s.clearTeam);
  const hasPokemons = slots.some(Boolean);

  if (!hasPokemons) return null;

  return (
    <button
      onClick={clearTeam}
      className="px-4 py-2 bg-gradient-to-b from-gray-400 to-gray-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-gray-700 shadow-md hover:from-gray-500 hover:to-gray-700 active:translate-y-0.5 transition-all duration-200 flex items-center"
      title="Clear all slots"
    >
      <Trash2 size={16} className="mr-1" />
      Clear Team
    </button>
  );
}
