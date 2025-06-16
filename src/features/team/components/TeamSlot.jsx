import React from 'react';

export default function TeamSlot({ pokemon, onRemove, slotNumber }) {
  return (
    <div className="relative flex flex-col items-center justify-end w-32 h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg border-2 border-yellow-400 transform transition-all hover:scale-105 hover:shadow-yellow-400/30 hover:z-10 overflow-hidden">
      {/* Slot number indicator */}
      <div className="absolute top-1 left-1 w-6 h-6 flex items-center justify-center bg-yellow-400 text-gray-900 font-bold text-xs rounded-full border-2 border-white shadow-sm">
        {slotNumber}
      </div>
      
      {/* Empty slot background */}
      {!pokemon && (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-16 h-16 rounded-full border-4 border-dashed border-yellow-400 animate-pulse"></div>
        </div>
      )}
      
      {/* Pokemon content */}
      <div className={`relative z-10 w-full h-full flex flex-col items-center justify-end p-2 transition-all duration-300 ${pokemon ? 'opacity-100' : 'opacity-60'}`}>
        {pokemon ? (
          <>
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
                  title="Quitar"
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="/pokeball.svg"
              alt="Empty Slot"
              className="w-10 h-10 object-contain opacity-40"
            />
            <span className="text-xs text-gray-400 mt-1">Vacío</span>
          </div>
        )}
      </div>
      
      {/* Glow effect */}
      {pokemon && (
        <div className="absolute inset-0 bg-yellow-400/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </div>
  );
}
