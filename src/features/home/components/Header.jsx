import Pokeball from '@/components/Pokeball';

export default function Header({ title = 'TEAM BUILDER' }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-red-600 py-2 px-4 border-b-4 border-yellow-400 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Pokeball />
        </div>
        <h1 className="text-white text-lg md:text-2xl font-bold text-center flex-1 px-4 uppercase">
          {title}
        </h1>
        <Pokeball />
      </div>
    </header>
  );
}
