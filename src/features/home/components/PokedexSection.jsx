import PokemonList from '@/features/pokemon/components/PokemonList';

export default function PokedexSection() {
  return (
    <section>
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border-4 border-red-500 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">POKÉDEX</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <PokemonList />
      </div>
    </section>
  );
}
