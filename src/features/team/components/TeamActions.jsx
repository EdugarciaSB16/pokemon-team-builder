import { useState } from 'react';
import { useTeamActions } from '@/features/team/hooks/useTeamActions';
import ActionButton from '@/components/ActionButton';

export default function TeamActions() {
  const {
    randomizeTeam,
    sortByAttack,
    saveTeam,
    discardDraft,
    draftName,
    isTeamEmpty,
  } = useTeamActions();

  const [name, setName] = useState('');

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mb-6">
      <div className="flex gap-2">
        <ActionButton
          onClick={randomizeTeam}
          className="bg-blue-200 hover:bg-blue-300"
        >
          Aleatorio
        </ActionButton>
        <ActionButton
          onClick={sortByAttack}
          className="bg-green-200 hover:bg-green-300"
        >
          Orden por ataque
        </ActionButton>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-xs px-2 py-1 border rounded w-full"
        />
        <ActionButton
          onClick={() => saveTeam(name)}
          disabled={isTeamEmpty}
          className="bg-yellow-300 hover:bg-yellow-400"
        >
          Guardar
        </ActionButton>
      </div>

      {draftName && (
        <div className="flex justify-between items-center border-t pt-2 mt-2">
          <span className="text-[10px] italic text-gray-500">
            Borrador activo: {draftName}
          </span>
          <button
            onClick={discardDraft}
            className="text-[10px] text-red-500 hover:underline"
          >
            Descartar
          </button>
        </div>
      )}
    </div>
  );
}
