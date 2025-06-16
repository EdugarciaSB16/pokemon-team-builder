export default function TeamSlotContent({ pokemon, onRemove }) {
  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-end p-2 transition-all duration-300">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain drop-shadow-md"
        />
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
            title="Remove"
          >
            ×
          </button>
        )}
      </div>
      <div className="w-full px-2 py-1 bg-black/50 rounded-b-md text-center">
        <p className="text-xs font-medium text-white capitalize truncate">
          {pokemon.name}
        </p>
      </div>
    </div>
  );
}
