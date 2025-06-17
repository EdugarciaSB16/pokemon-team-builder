import TeamSlots from '@/features/team/components/TeamSlots';
import TeamActions from '@/features/team/components/TeamActions';
import { useTeamStore } from '@/features/team/store';

export default function TeamSection() {
  const isDraft = useTeamStore((s) => s.isDraft);

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

        {isDraft && (
          <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
            <div className="flex justify-between items-center">
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
              <button
                onClick={() => useTeamStore.getState().discardDraft()}
                className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center"
                title="Discard draft"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
