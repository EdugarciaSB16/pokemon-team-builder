import { useTeamStore } from '@/features/team/store';
import TeamSlot from './TeamSlot';

export default function TeamSlots() {
  const team = useTeamStore((state) => state.team);
  const removePokemon = useTeamStore((state) => state.removePokemon);

  return (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
      {team.map((pokemon, index) => (
        <TeamSlot
          key={index}
          pokemon={pokemon}
          onRemove={() => removePokemon(index)}
        />
      ))}
    </div>
  );
}
