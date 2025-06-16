import TeamSlotWrapper from './TeamSlotWrapper';
import TeamSlotEmpty from './TeamSlotEmpty';
import TeamSlotContent from './TeamSlotContent';

export default function TeamSlot({ pokemon, onRemove, slotNumber }) {
  return (
    <TeamSlotWrapper>
      <div className="absolute top-1 left-1 w-6 h-6 flex items-center justify-center bg-yellow-400 text-gray-900 font-bold text-xs rounded-full border-2 border-white shadow-sm">
        {slotNumber}
      </div>

      {!pokemon && <TeamSlotEmpty />}

      {pokemon ? (
        <TeamSlotContent pokemon={pokemon} onRemove={onRemove} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src="/pokeball.svg"
            alt="Empty Slot"
            className="w-10 h-10 object-contain opacity-40"
          />
          <span className="text-xs text-gray-400 mt-1">Empty</span>
        </div>
      )}

      {pokemon && (
        <div className="absolute inset-0 bg-yellow-400/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </TeamSlotWrapper>
  );
}
