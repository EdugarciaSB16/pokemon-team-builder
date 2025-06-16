import React from 'react';

export default function TeamSlot({ pokemon, onRemove }) {
  return (
    <div className="flex flex-col items-center justify-center w-28 h-28 border border-gray-300 rounded bg-white shadow">
      {pokemon ? (
        <>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-16 h-16 object-contain"
          />
          <p className="text-[10px] text-center mt-1">{pokemon.name}</p>
          <button
            onClick={onRemove}
            className="text-red-500 text-[10px] mt-1 hover:underline"
          >
            Quitar
          </button>
        </>
      ) : (
        <img
          src="/pokeball.svg"
          alt="Empty"
          className="w-10 h-10 object-contain opacity-60"
        />
      )}
    </div>
  );
}
