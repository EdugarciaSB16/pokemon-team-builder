import { useState } from 'react';
import { useTeamActions } from '@/features/team/hooks/useTeamActions';

export default function RandomizeButton() {
  const { randomizeTeam } = useTeamActions();
  const [isShaking, setIsShaking] = useState(false);

  const handleRandomize = () => {
    setIsShaking(true);
    randomizeTeam();
    setTimeout(() => setIsShaking(false), 1000);
  };

  return (
    <button
      onClick={handleRandomize}
      className={`px-4 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-blue-700 shadow-md hover:from-blue-500 hover:to-blue-700 active:translate-y-0.5 transition-all duration-200 flex items-center ${
        isShaking ? 'animate-shake' : ''
      }`}
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
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Randomize
    </button>
  );
}
