import { useState } from 'react';
import { useTeamActions } from '@/features/team/hooks/useTeamActions';
import { Shuffle } from 'lucide-react';

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
      <Shuffle size={16} className="mr-1" />
      Randomize
    </button>
  );
}
