import { useTeamStore } from '@/features/team/store';
import TeamSlot from './TeamSlot';

export default function TeamSlots({ cardSize = 'normal' }) {
  const team = useTeamStore((state) => state.team);
  const removePokemon = useTeamStore((state) => state.removePokemon);
  const reorderTeam = useTeamStore((state) => state.reorderTeam);

  const slots = Array(6).fill(null);
  team.forEach((pokemon, index) => {
    if (index < 6) slots[index] = pokemon;
  });

  const handleMoveSlot = (from, to) => {
    if (from === to) return;
    const newTeam = [...team];
    const [moved] = newTeam.splice(from, 1);
    newTeam.splice(to, 0, moved);
    reorderTeam(newTeam.slice(0, 6));
  };

  return (
    <div className="w-full overflow-x-auto py-4 px-2">
      <div className="flex justify-center gap-4 min-w-max mx-auto">
        {slots.map((pokemon, index) => (
          <TeamSlot
            key={index}
            pokemon={pokemon}
            onRemove={
              pokemon ? () => removePokemon(team.indexOf(pokemon)) : null
            }
            slotNumber={index + 1}
            index={index}
            onMoveSlot={handleMoveSlot}
            cardSize={cardSize}
          />
        ))}
      </div>
    </div>
  );
}
