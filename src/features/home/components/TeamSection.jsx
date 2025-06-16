import TeamSlots from '@/features/team/components/TeamSlots';
import TeamActions from '@/features/team/components/TeamActions';

export default function TeamSection() {
  return (
    <section className="mb-8">
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border-4 border-yellow-400 shadow-lg mb-6">
        <h2 className="text-center text-lg font-bold text-gray-800 mb-4">
          YOUR POKÉMON TEAM
        </h2>
        <TeamSlots />
        <TeamActions />
      </div>
    </section>
  );
}
