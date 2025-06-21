import React from 'react';
import { useTeamStore } from '@/features/team/store';
import TeamSlot from './TeamSlot';

export default function TeamSlots({ cardSize = 'normal' }) {
  const slots = useTeamStore((state) => state.slots);
  const removePokemon = useTeamStore((state) => state.removePokemon);
  const reorderTeam = useTeamStore((state) => state.reorderTeam);

  const handleMoveSlot = (from, to) => {
    if (from === to) return;
    const newSlots = [...slots];
    const [moved] = newSlots.splice(from, 1);
    newSlots.splice(to, 0, moved);
    reorderTeam(newSlots.slice(0, 6));
  };

  return (
    <div className="w-full overflow-x-auto py-4 px-2">
      <div className="flex justify-center gap-4 min-w-max mx-auto">
        {slots.map((pokemon, index) => (
          <TeamSlot
            key={index}
            pokemon={pokemon}
            onRemove={pokemon ? () => removePokemon(index) : null}
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
