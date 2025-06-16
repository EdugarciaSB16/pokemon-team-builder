import { useTeamActions } from '@/features/team/hooks/useTeamActions';

export default function SortByAttackButton() {
  const { sortByAttack } = useTeamActions();

  return (
    <button
      onClick={sortByAttack}
      className="px-4 py-2 bg-gradient-to-b from-red-400 to-red-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-red-700 shadow-md hover:from-red-500 hover:to-red-700 active:translate-y-0.5 transition-all duration-200 flex items-center"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
      Sort by Attack
    </button>
  );
}
