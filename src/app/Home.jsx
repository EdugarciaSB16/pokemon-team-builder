import { useEffect, useState } from 'react';
import TeamSlots from '@/features/team/components/TeamSlots';
import TeamActions from '@/features/team/components/TeamActions';
import PokemonList from '@/features/pokemon/components/PokemonList';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the Pokéball animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-red-100">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative animate-bounce">
            <div className="w-full h-full rounded-full border-4 border-gray-800 bg-white overflow-hidden">
              <div className="h-1/2 bg-red-500"></div>
              <div className="h-1/2 bg-white"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white border-4 border-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Loading Pokémon adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-red-100">
      {/* Header with game-like border */}
      <header className="bg-gradient-to-r from-blue-600 to-red-600 py-2 px-4 border-b-4 border-yellow-400 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white shadow-inner flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-white text-xs md:text-sm font-bold tracking-wider">
              POKÉDEX
            </span>
          </div>
          <h1 className="text-white text-lg md:text-2xl font-bold text-center flex-1 px-4 uppercase">
            TEAM BUILDER
          </h1>
          <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white shadow-inner"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Team Section */}
        <section className="mb-8">
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border-4 border-yellow-400 shadow-lg mb-6">
            <h2 className="text-center text-lg font-bold text-gray-800 mb-4">
              TU EQUIPO POKÉMON
            </h2>
            <TeamSlots />
            <TeamActions />
          </div>
        </section>

        {/* Pokédex Section */}
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center text-xs">
        <p>© 2025 Pokémon Team Builder</p>
      </footer>
    </div>
  );
}
