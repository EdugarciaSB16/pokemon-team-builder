export default function TeamSlotWrapper({ children }) {
  return (
    <div className="relative flex flex-col items-center justify-end w-32 h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg border-2 border-yellow-400 transform transition-all hover:scale-105 hover:shadow-yellow-400/30 hover:z-10 overflow-hidden">
      {children}
    </div>
  );
}
