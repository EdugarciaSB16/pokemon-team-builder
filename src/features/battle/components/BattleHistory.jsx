import React from 'react';
import { Swords } from 'lucide-react';

export default function BattleHistory({ displayedBattleRounds, battleData }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <div className="bg-gray-100 p-2 rounded-lg">
          <Swords size={24} className="text-gray-600" />
        </div>
        Battle History
      </h2>
      <div className="space-y-3 max-h-[40vh] lg:max-h-[600px] overflow-y-auto pr-2">
        {displayedBattleRounds.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-sm transition-all duration-200 ${
              result.winner === 'A'
                ? 'bg-red-50 border border-red-200 hover:bg-red-100'
                : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">
                Round {result.round}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  result.winner === 'A'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {result.winner === 'A'
                  ? battleData.team1Name
                  : battleData.team2Name}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{result.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
