import RandomizeButton from './RandomizeButton';
import SortByAttackButton from './SortByAttackButton';
import SaveTeamInput from './SaveTeamInput';
import DraftInfo from './DraftInfo';
import { useTeamActions } from '@/features/team/hooks/useTeamActions';

export default function TeamActions() {
  const { draftName } = useTeamActions();

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-2">
      <div className="flex flex-wrap justify-center gap-3">
        <RandomizeButton />
        <SortByAttackButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <SaveTeamInput />
      </div>

      <DraftInfo draftName={draftName} />
    </div>
  );
}
