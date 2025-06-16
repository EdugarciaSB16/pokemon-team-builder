import { useEffect, useState } from 'react';
import LoadingScreen from '@/features/home/components/LoadingScreen';
import Header from '@/features/home/components/Header';
import TeamSection from '@/features/home/components/TeamSection';
import PokedexSection from '@/features/home/components/PokedexSection';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-red-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <TeamSection />
        <PokedexSection />
      </main>
      <footer className="bg-gray-900 text-white py-4 text-center text-xs">
        <p>© 2025 Pokémon Team Builder</p>
      </footer>
    </div>
  );
}
