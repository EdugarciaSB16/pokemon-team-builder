import { useEffect, useState } from 'react';
import { useTeamActions } from '@/features/team/hooks/useTeamActions';
import { Save } from 'lucide-react';

export default function SaveTeamInput() {
  const { saveTeam, team } = useTeamActions();
  const [name, setName] = useState('');

  const isTeamComplete = team.every(Boolean);

  const handleSave = () => {
    if (name.trim() && isTeamComplete) {
      saveTeam(name);
      setName('');
      const saveBtn = document.getElementById('save-team-btn');
      if (saveBtn) {
        saveBtn.classList.add('animate-ping');
        setTimeout(() => saveBtn.classList.remove('animate-ping'), 300);
      }
    }
  };

  useEffect(() => {
    const input = document.getElementById('team-name-input');
    if (input) input.focus();
  }, []);

  return (
    <>
      <div className="relative w-full max-w-xs">
        <input
          id="team-name-input"
          type="text"
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          className="w-full px-4 py-2 text-sm bg-white/90 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-inner"
        />
      </div>

      <button
        id="save-team-btn"
        onClick={handleSave}
        disabled={!isTeamComplete || !name.trim()}
        className={`px-6 py-2 bg-gradient-to-b from-yellow-400 to-yellow-600 text-gray-900 text-sm font-bold rounded-lg border-2 border-yellow-700 shadow-md hover:from-yellow-300 hover:to-yellow-500 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center min-w-[120px] ${
          !isTeamComplete || !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={
          !isTeamComplete
            ? 'Team must have 6 Pokémon'
            : !name.trim()
            ? 'Enter a team name'
            : 'Save team'
        }
      >
        <Save size={16} className="mr-1" />
        Save
      </button>
    </>
  );
}
