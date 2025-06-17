import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TeamSlotWrapper from './TeamSlotWrapper';
import TeamSlotContent from './TeamSlotContent';

const ItemType = 'TEAM_SLOT';

export default function TeamSlot({
  pokemon,
  onRemove,
  slotNumber,
  index,
  onMoveSlot,
  cardSize = 'normal',
}) {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    canDrag: !!pokemon,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        onMoveSlot(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const sizeClass = cardSize === 'large' ? 'w-44 h-56' : 'w-32 h-32';

  return (
    <TeamSlotWrapper
      ref={ref}
      className={`${sizeClass} ${isDragging ? 'opacity-50' : ''} ${
        isOver ? 'bg-yellow-100' : ''
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-7 h-7 flex items-center justify-center bg-yellow-400 text-gray-900 font-bold text-sm rounded-full border-2 border-white shadow-sm z-20`}
        style={{ cursor: pokemon ? 'grab' : 'default' }}
      >
        {slotNumber}
      </div>

      {pokemon ? (
        <TeamSlotContent
          pokemon={pokemon}
          onRemove={onRemove}
          cardSize={cardSize}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/pokeball.svg"
              alt="Empty Slot"
              className="w-12 h-12 object-contain opacity-40"
            />
          </div>
          <span className="text-sm text-gray-400 font-medium mt-2">Empty</span>
        </div>
      )}

      {pokemon && (
        <div className="absolute inset-0 bg-yellow-400/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </TeamSlotWrapper>
  );
}
