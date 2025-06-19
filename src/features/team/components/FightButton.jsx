import { useState } from 'react';
import { useTeamStore } from '@/features/team/store';
import { Swords } from 'lucide-react';
import BattleSelectionModal from '@/features/battle/components/BattleSelectionModal';

export default function FightButton() {
  const [showBattleModal, setShowBattleModal] = useState(false);
  const { isTeamReadyForBattle } = useTeamStore();
  const isDisabled = !isTeamReadyForBattle();

  return (
    <>
      <button
        onClick={() => setShowBattleModal(true)}
        disabled={isDisabled}
        className={`px-4 py-2 bg-gradient-to-b text-white text-xs md:text-sm font-bold rounded-lg border-2 shadow-md transition-all duration-200 flex items-center ${
          isDisabled
            ? 'from-gray-400 to-gray-500 border-gray-600 cursor-not-allowed opacity-50'
            : 'from-red-500 to-red-700 border-red-800 hover:from-red-600 hover:to-red-800 active:translate-y-0.5'
        }`}
        title={
          isDisabled
            ? 'Need a complete saved team to battle'
            : 'Start a battle with your team'
        }
      >
        <Swords size={16} className="mr-1" />
        Fight!
      </button>

      {showBattleModal && (
        <BattleSelectionModal onClose={() => setShowBattleModal(false)} />
      )}
    </>
  );
}
