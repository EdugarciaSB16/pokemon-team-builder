import { useState, useEffect } from 'react';
import { useTeamActions } from '@/features/team/hooks/useTeamActions';

export default function TeamActions() {
  const {
    randomizeTeam,
    sortByAttack,
    saveTeam,
    discardDraft,
    draftName,
    isTeamEmpty,
  } = useTeamActions();

  const [name, setName] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleRandomize = () => {
    setIsShaking(true);
    randomizeTeam();
    // Add a small delay to show the shake animation
    setTimeout(() => setIsShaking(false), 1000);
  };

  const handleSave = () => {
    if (name.trim() && !isTeamEmpty) {
      saveTeam(name);
      // Add a small visual feedback
      const saveBtn = document.getElementById('save-team-btn');
      if (saveBtn) {
        saveBtn.classList.add('animate-ping');
        setTimeout(() => saveBtn.classList.remove('animate-ping'), 300);
      }
    }
  };

  // Auto-focus the input when the component mounts
  useEffect(() => {
    const input = document.getElementById('team-name-input');
    if (input) input.focus();
  }, []);

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-2">
      <div className="flex flex-wrap justify-center gap-3">
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
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Aleatorio
        </button>

        <button
          onClick={sortByAttack}
          className="px-4 py-2 bg-gradient-to-b from-red-400 to-red-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-red-700 shadow-md hover:from-red-500 hover:to-red-700 active:translate-y-0.5 transition-all duration-200 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          Ordenar por ataque
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <div className="relative w-full max-w-xs">
          <input
            id="team-name-input"
            type="text"
            placeholder="Nombre del equipo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className="w-full px-4 py-2 text-sm bg-white/90 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        </div>

        <button
          id="save-team-btn"
          onClick={handleSave}
          disabled={isTeamEmpty || !name.trim()}
          className={`px-6 py-2 bg-gradient-to-b from-yellow-400 to-yellow-600 text-gray-900 text-sm font-bold rounded-lg border-2 border-yellow-700 shadow-md hover:from-yellow-300 hover:to-yellow-500 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center min-w-[120px] ${
            isTeamEmpty || !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Guardar
        </button>
      </div>

      {draftName && (
        <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs md:text-sm text-gray-700">
                Borrador activo: <span className="font-bold">{draftName}</span>
              </span>
            </div>
            <button
              onClick={discardDraft}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
