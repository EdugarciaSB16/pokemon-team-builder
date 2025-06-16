const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-600',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-800',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonTypes({ types = [] }) {
  return (
    <div className="flex justify-center gap-1.5 mb-3">
      {types.map((type, index) => (
        <span
          key={index}
          className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${
            typeColors[type.type.name] || 'bg-gray-400'
          }`}
        >
          {type.type.name}
        </span>
      ))}
    </div>
  );
}
