export default function LoadingScreen() {
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
