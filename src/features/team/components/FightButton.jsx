import { useTeamStore } from '@/features/team/store';
import { useNavigate } from 'react-router-dom';

export default function FightButton() {
  const navigate = useNavigate();
  const slots = useTeamStore((s) => s.slots);
  const filledSlots = slots.filter(Boolean).length;
  const isDisabled = filledSlots < 2;

  return (
    <button
      onClick={() => navigate('/battle')}
      disabled={isDisabled}
      className={`px-4 py-2 bg-gradient-to-b text-white text-xs md:text-sm font-bold rounded-lg border-2 shadow-md transition-all duration-200 flex items-center ${
        isDisabled
          ? 'from-gray-400 to-gray-500 border-gray-600 cursor-not-allowed opacity-50'
          : 'from-red-500 to-red-700 border-red-800 hover:from-red-600 hover:to-red-800 active:translate-y-0.5'
      }`}
      title={
        isDisabled ? 'Need at least 2 Pokémon to battle' : 'Go to battle screen'
      }
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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Fight!
    </button>
  );
}
