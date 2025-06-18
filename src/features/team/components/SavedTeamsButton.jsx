import { useState } from 'react';
import { useTeamStore } from '@/features/team/store';

export default function SavedTeamsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const savedTeams = useTeamStore((s) => s.savedTeams);
  const loadTeam = useTeamStore((s) => s.loadTeam);
  const deleteTeam = useTeamStore((s) => s.deleteTeam);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-gradient-to-b from-indigo-400 to-indigo-500 text-white text-xs font-bold rounded-lg border border-indigo-600 shadow-md hover:from-indigo-500 hover:to-indigo-600 active:translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
        title="View saved teams"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        My Teams
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[400px] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Saved Teams</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            loadTeam(team);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 text-sm font-medium border border-blue-700 transition-all duration-200"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="px-3 py-1.5 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-700 text-sm font-medium border border-red-700 transition-all duration-200"
                        >
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
