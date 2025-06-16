export default function Header() {
  return (
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
  );
}
