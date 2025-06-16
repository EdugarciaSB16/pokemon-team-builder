import { useTeamStore } from '@/features/team/store';
import TeamSlot from './TeamSlot';

export default function TeamSlots() {
  const team = useTeamStore((state) => state.team);
  const removePokemon = useTeamStore((state) => state.removePokemon);

  const slots = Array(6).fill(null);
  team.forEach((pokemon, index) => {
    if (index < 6) slots[index] = pokemon;
  });

  return (
    <div className="w-full overflow-x-auto py-4 px-2">
      <div className="flex justify-center gap-2 min-w-max mx-auto">
        {slots.map((pokemon, index) => (
          <TeamSlot
            key={index}
            pokemon={pokemon}
            onRemove={
              pokemon ? () => removePokemon(team.indexOf(pokemon)) : null
            }
            slotNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
