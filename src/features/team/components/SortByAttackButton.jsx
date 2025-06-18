import { useTeamActions } from '@/features/team/hooks/useTeamActions';
import { ArrowUpDown } from 'lucide-react';

export default function SortByAttackButton() {
  const { sortByAttack } = useTeamActions();

  return (
    <button
      onClick={sortByAttack}
      className="px-4 py-2 bg-gradient-to-b from-red-400 to-red-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-red-700 shadow-md hover:from-red-500 hover:to-red-700 active:translate-y-0.5 transition-all duration-200 flex items-center"
    >
      <ArrowUpDown size={16} className="mr-1" />
      Sort by Attack
    </button>
  );
}
