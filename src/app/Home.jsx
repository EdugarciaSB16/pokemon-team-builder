import TeamSlots from '@/features/team/components/TeamSlots';
import TeamActions from '@/features/team/components/TeamActions';
import PokemonList from '@/features/pokemon/components/PokemonList';

export default function Home() {
  return (
    <main className="px-6 py-10">
      <h1 className="text-xl mb-4 text-center font-bold">
        Pokémon Team Builder
      </h1>
      <TeamSlots />
      <TeamActions />
      <PokemonList />
    </main>
  );
}
