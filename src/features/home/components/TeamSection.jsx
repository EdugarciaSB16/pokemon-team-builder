import TeamSlots from '@/features/team/components/TeamSlots';
import TeamActions from '@/features/team/components/TeamActions';
import SavedTeamsButton from '@/features/team/components/SavedTeamsButton';
import { useTeamStore } from '@/features/team/store';

export default function TeamSection() {
  const isDraft = useTeamStore((s) => s.isDraft);
  const slots = useTeamStore((s) => s.slots);
  const hasPokemons = slots.some(Boolean);

  return (
    <section className="mb-8">
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl border-4 border-yellow-400 shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
          <div className="w-32"></div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-widest drop-shadow uppercase text-center flex-1">
            YOUR POKÉMON TEAM
          </h2>
          <div className="w-32 flex justify-end">
            <SavedTeamsButton />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <TeamSlots cardSize="large" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-2">
          <TeamActions />
        </div>

        {isDraft && hasPokemons && (
          <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs md:text-sm text-gray-700">
                Draft in progress
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
