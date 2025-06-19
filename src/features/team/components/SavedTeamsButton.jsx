import { useState } from 'react';
import { useTeamStore } from '@/features/team/store';
import { Archive, X, Download, Trash2 } from 'lucide-react';

export default function SavedTeamsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const savedTeams = useTeamStore((s) => s.savedTeams);
  const loadTeam = useTeamStore((s) => s.loadTeam);
  const deleteTeam = useTeamStore((s) => s.deleteTeam);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-b from-green-400 to-green-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-green-700 shadow-md hover:from-green-500 hover:to-green-700 active:translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
        title="View saved teams"
      >
        <Archive size={16} />
        Teams
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[400px] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Saved Teams</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {savedTeams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No teams saved yet
                </div>
              ) : (
                <div className="space-y-4">
                  {savedTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div>
                        <h4 className="font-bold text-gray-800">{team.name}</h4>
                        <p className="text-xs text-gray-500">
                          Created:{' '}
                          {new Date(team.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Pokémon: {team.slots.filter(Boolean).length}/6
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            loadTeam(team);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 text-sm font-medium border border-blue-700 transition-all duration-200 flex items-center gap-1"
                        >
                          <Download size={14} />
                          Load
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="px-3 py-1.5 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-700 text-sm font-medium border border-red-700 transition-all duration-200 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
