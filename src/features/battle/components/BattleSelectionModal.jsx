import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTeamStore } from '@/features/team/store';
import { BattleService } from '@/features/battle/services/battleService';
import { X, Users, Zap, Play, Shield, Loader2 } from 'lucide-react';

export default function BattleSelectionModal({ onClose }) {
  const navigate = useNavigate();
  const { savedTeams, getCurrentTeamForBattle } = useTeamStore();
  const [selectedTeam2, setSelectedTeam2] = useState('random');
  const [selectedTeam2Id, setSelectedTeam2Id] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentTeam = getCurrentTeamForBattle();

  const handleStartBattle = async () => {
    if (!currentTeam) return;

    setIsLoading(true);

    try {
      let team2, team2Name;

      if (selectedTeam2 === 'random') {
        team2 = await BattleService.generateRandomTeamFromAPI();
        team2Name = 'Random Team';
      } else {
        team2 =
          savedTeams
            .find((t) => t.id === selectedTeam2Id)
            ?.slots.filter(Boolean) || [];
        team2Name =
          savedTeams.find((t) => t.id === selectedTeam2Id)?.name || 'Team 2';
      }

      const battleData = {
        team1: currentTeam.pokemons,
        team2: team2,
        team1Name: currentTeam.name,
        team2Name: team2Name,
        team1Id: currentTeam.id,
        team2Id: selectedTeam2 === 'random' ? 'random' : selectedTeam2Id,
      };

      localStorage.setItem('battle-data', JSON.stringify(battleData));
      navigate('/battle');
    } catch (error) {
      console.error('Error starting battle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canStartBattle =
    currentTeam &&
    !isLoading &&
    (selectedTeam2 === 'random' ||
      (selectedTeam2 === 'saved' &&
        selectedTeam2Id &&
        selectedTeam2Id !== currentTeam.id));

  const modal = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 select-none">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col z-[9999] relative">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Shield size={24} className="mr-2" />
            Battle Setup
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-green-600">
              <Users size={20} className="mr-2" />
              Your Team: {currentTeam?.name}
            </h3>
            {currentTeam ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {currentTeam.pokemons.map((pokemon, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="capitalize font-medium">
                        {pokemon.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700">
                No team loaded. Please save or load a team first.
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-red-600">
              <Zap size={20} className="mr-2" />
              Choose Opponent
            </h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                <input
                  type="radio"
                  name="opponent"
                  value="random"
                  checked={selectedTeam2 === 'random'}
                  onChange={(e) => setSelectedTeam2(e.target.value)}
                  className="mr-3"
                  disabled={isLoading}
                />
                <div>
                  <div className="font-medium flex items-center">
                    Random Team
                    {isLoading && selectedTeam2 === 'random' && (
                      <Loader2 size={16} className="ml-2 animate-spin" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Battle against a computer-generated team from all Pokémon
                  </div>
                </div>
              </label>
              {savedTeams
                .filter((team) => team.id !== currentTeam?.id)
                .map((team) => (
                  <label
                    key={team.id}
                    className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-red-300 transition-colors"
                  >
                    <input
                      type="radio"
                      name="opponent"
                      value="saved"
                      checked={
                        selectedTeam2 === 'saved' && selectedTeam2Id === team.id
                      }
                      onChange={() => {
                        setSelectedTeam2('saved');
                        setSelectedTeam2Id(team.id);
                      }}
                      className="mr-3"
                      disabled={isLoading}
                    />
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-600">
                        {team.slots.filter(Boolean).length}/6 Pokémon
                      </div>
                    </div>
                  </label>
                ))}
            </div>
            {savedTeams.filter((team) => team.id !== currentTeam?.id).length ===
              0 && (
              <div className="text-center py-4 text-gray-500">
                No other saved teams available. Choose Random Team to battle.
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-center z-10">
          <button
            onClick={handleStartBattle}
            disabled={!canStartBattle}
            className={`w-full py-3 px-4 rounded-lg border-2 font-bold transition-all duration-200 flex items-center justify-center ${
              canStartBattle
                ? 'bg-gradient-to-b from-red-500 to-red-700 text-white border-red-800 hover:from-red-600 hover:to-red-800'
                : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Generating Team...
              </>
            ) : (
              <>
                <Play size={20} className="mr-2" />
                Start Battle!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
