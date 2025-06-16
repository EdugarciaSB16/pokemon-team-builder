import { useTeamActions } from '@/features/team/hooks/useTeamActions';

export default function DraftInfo({ draftName }) {
  const { discardDraft } = useTeamActions();

  if (!draftName) return null;

  return (
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
            Active draft: <span className="font-bold">{draftName}</span>
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
  );
}
