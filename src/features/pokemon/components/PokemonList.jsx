import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
import PokemonCard from './PokemonCard';

export default function PokemonList() {
  const { data: pokemons, isLoading, isError } = usePokemonList(30);

  if (isLoading) return <p className="text-center">Cargando...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error al cargar pokémon.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}
