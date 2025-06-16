import { useTeamStore } from '@/features/team/store';
import { EMPTY_TEAM } from '@/features/team/constants';

export function useTeamActions() {
  const randomizeTeam = useTeamStore((s) => s.randomizeTeam);
  const sortByAttack = useTeamStore((s) => s.sortByAttack);
  const saveTeam = useTeamStore((s) => s.saveTeam);
  const discardDraft = useTeamStore((s) => s.discardDraft);
  const draftName = useTeamStore((s) => s.draftName);
  const team = useTeamStore((s) => s.team);

  const isTeamEmpty = team.every((slot) => slot === null);

  return {
    randomizeTeam,
    sortByAttack,
    saveTeam,
    discardDraft,
    draftName,
    team,
    isTeamEmpty,
  };
}
