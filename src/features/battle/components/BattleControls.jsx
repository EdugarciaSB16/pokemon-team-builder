import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BattleControls({ onBackToHome }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <button
        onClick={onBackToHome}
        className="px-4 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-blue-700 shadow-md hover:from-blue-500 hover:to-blue-700 active:translate-y-0.5 transition-all duration-200 flex items-center"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Team Builder
      </button>
    </div>
  );
}
