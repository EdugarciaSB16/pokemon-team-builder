import React from 'react';
import { Trophy, X } from 'lucide-react';

export default function BattleResults({
  isComplete,
  showResults,
  survivorsA,
  survivorsB,
  battleData,
  onClose,
  onBackToHome,
}) {
  if (!isComplete || !showResults) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Trophy size={40} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Battle Complete!
          </h2>
          <p className="text-gray-600">The epic battle has come to an end</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              survivorsA > survivorsB
                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-lg scale-105'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h3 className="font-bold text-xl mb-3 text-red-700">
              {battleData.team1Name}
            </h3>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {survivorsA}
              </div>
              <p className="text-gray-600">Surviving Pokémon</p>
            </div>
            {survivorsA > survivorsB && (
              <div className="mt-3 text-center">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                  🏆 WINNER!
                </span>
              </div>
            )}
          </div>

          <div
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              survivorsB > survivorsA
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg scale-105'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h3 className="font-bold text-xl mb-3 text-blue-700">
              {battleData.team2Name}
            </h3>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {survivorsB}
              </div>
              <p className="text-gray-600">Surviving Pokémon</p>
            </div>
            {survivorsB > survivorsA && (
              <div className="mt-3 text-center">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                  🏆 WINNER!
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBackToHome}
            className="px-6 py-3 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-sm font-bold rounded-lg border-2 border-blue-700 shadow-md hover:from-blue-500 hover:to-blue-700 active:translate-y-0.5 transition-all duration-200"
          >
            Return to Team Builder
          </button>
        </div>
      </div>
    </div>
  );
}
