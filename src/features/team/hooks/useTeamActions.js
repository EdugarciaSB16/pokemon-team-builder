import { useTeamStore } from '../store';

export function useTeamActions() {
  const randomizeTeam = useTeamStore((s) => s.randomizeTeam);
  const sortByAttack = useTeamStore((s) => s.sortByAttack);
  const saveTeam = useTeamStore((s) => s.saveTeam);
  const discardDraft = useTeamStore((s) => s.discardDraft);
  const isDraft = useTeamStore((s) => s.isDraft);
  const slots = useTeamStore((s) => s.slots);

  const isTeamEmpty = slots.every((slot) => slot === null);

  return {
    randomizeTeam,
    sortByAttack,
    saveTeam,
    discardDraft,
    isDraft,
    team: slots,
    isTeamEmpty,
  };
}
