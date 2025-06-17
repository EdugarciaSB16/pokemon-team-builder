import TeamSlots from '@/features/team/components/slots/TeamSlots';
import TeamActions from '@/features/team/components/TeamActions';
import { useTeamStore } from '@/features/team/store';
import { useBattleStore } from '@/features/battle/store';

export default function TeamSection() {
  const team = useTeamStore((s) => s.team);
  const savedTeams = useTeamStore((s) => s.savedTeams);

  const { selectTeamA } = useBattleStore();

  const currentSaved = savedTeams.find(
    (t) => t.pokemons && t.pokemons.every((p, i) => p?.id === team[i]?.id)
  );

  const hasTeamMembers = team.some(Boolean);

  const handleFight = () => {
    if (currentSaved) selectTeamA(currentSaved);
    alert('Selecciona el equipo rival para pelear (falta UI)');
  };

  return (
    <section className="mb-8">
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl border-4 border-yellow-400 shadow-2xl mb-6">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6 tracking-widest drop-shadow">
          YOUR POKÉMON TEAM
        </h2>

        <div className="flex flex-col items-center">
          <TeamSlots cardSize="large" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-2">
          <TeamActions />
        </div>

        {hasTeamMembers && (
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              onClick={handleFight}
              className="px-5 py-2 bg-gradient-to-b from-green-400 to-green-600 text-white text-sm font-bold rounded-lg border-2 border-green-700 shadow-md hover:from-green-300 hover:to-green-500 active:translate-y-0.5 transition-all duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3"
                />
              </svg>
              Fight
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
