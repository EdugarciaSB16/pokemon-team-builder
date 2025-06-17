import RandomizeButton from './RandomizeButton';
import SortByAttackButton from './SortByAttackButton';
import SaveTeamInput from './SaveTeamInput';

export default function TeamActions() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto px-2">
      <div className="flex flex-wrap justify-center gap-3">
        <RandomizeButton />
        <SortByAttackButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <SaveTeamInput />
      </div>
    </div>
  );
}
