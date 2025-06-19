import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BattleService } from '@/features/battle/services/battleService';
import { ArrowLeft, Swords, Zap, Shield, Trophy, Users } from 'lucide-react';

export default function Battle() {
  const navigate = useNavigate();
  const [battleData, setBattleData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [battleResults, setBattleResults] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!battleData) {
      const data = localStorage.getItem('battle-data');
      if (!data) {
        navigate('/');
        return;
      }
      const parsedData = JSON.parse(data);
      setBattleData(parsedData);
    }
  }, [navigate, battleData]);

  useEffect(() => {
    if (battleData && currentRound < 6) {
      const timer = setTimeout(() => {
        const result = BattleService.simulateRound(
          currentRound,
          battleData.team1,
          battleData.team2
        );
        setBattleResults((prev) => [...prev, result]);
        setCurrentRound((prev) => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (currentRound >= 6) {
      setIsComplete(true);
    }
  }, [currentRound, battleData]);

  const getFinalResults = () => {
    if (!battleData) return null;
    return BattleService.calculateFinalResults(
      battleResults,
      battleData.team1,
      battleData.team2
    );
  };

  const handleBackToHome = () => {
    localStorage.removeItem('battle-data');
    navigate('/');
  };

  if (!battleData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Team Builder
          </button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield size={32} className="mr-3" />
            Battle Arena
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-red-200">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
              <Users size={24} className="mr-2" />
              {battleData.team1Name}
            </h2>
            <div className="space-y-2">
              {battleData.team1.map((pokemon, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium capitalize text-lg">
                      {pokemon.name}
                    </span>
                  </div>
                  <div className="flex space-x-3 text-sm">
                    <span className="text-blue-600 font-semibold">
                      ATK: {BattleService.getPokemonStats(pokemon, 'attack')}
                    </span>
                    <span className="text-green-600 font-semibold">
                      DEF: {BattleService.getPokemonStats(pokemon, 'defense')}
                    </span>
                    <span className="text-purple-600 font-semibold">
                      SPD: {BattleService.getPokemonStats(pokemon, 'speed')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
              <Users size={24} className="mr-2" />
              {battleData.team2Name}
            </h2>
            <div className="space-y-2">
              {battleData.team2.map((pokemon, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium capitalize text-lg">
                      {pokemon.name}
                    </span>
                  </div>
                  <div className="flex space-x-3 text-sm">
                    <span className="text-blue-600 font-semibold">
                      ATK: {BattleService.getPokemonStats(pokemon, 'attack')}
                    </span>
                    <span className="text-green-600 font-semibold">
                      DEF: {BattleService.getPokemonStats(pokemon, 'defense')}
                    </span>
                    <span className="text-purple-600 font-semibold">
                      SPD: {BattleService.getPokemonStats(pokemon, 'speed')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Swords size={28} className="mr-3" />
            Battle Progress
          </h2>

          {!isComplete && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <Zap size={64} className="mx-auto mb-6 text-yellow-500" />
                <p className="text-2xl font-bold text-gray-700 mb-2">
                  Round {currentRound + 1}
                </p>
                <p className="text-lg text-gray-600">Battle in progress...</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {battleResults.map((result, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  result.winner === 'Team 1'
                    ? 'border-red-300 bg-red-50 shadow-lg'
                    : 'border-blue-300 bg-blue-50 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        result.winner === 'Team 1'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {result.round}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="capitalize font-bold text-lg">
                        {result.pokemon1}
                      </span>
                      <Swords size={20} className="text-gray-400" />
                      <span className="capitalize font-bold text-lg">
                        {result.pokemon2}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      result.winner === 'Team 1'
                        ? 'bg-red-100 text-red-800 border-2 border-red-300'
                        : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    }`}
                  >
                    {result.winner} Wins
                  </div>
                </div>

                <p className="text-gray-700 font-medium">{result.reason}</p>

                {result.pokemon1Stats && result.pokemon2Stats && (
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="bg-white/50 rounded p-3">
                      <p className="font-semibold mb-2">{result.pokemon1}</p>
                      <div className="space-y-1">
                        <span className="text-blue-600">
                          ATK: {result.pokemon1Stats.attack}
                        </span>
                        <span className="text-green-600 ml-3">
                          DEF: {result.pokemon1Stats.defense}
                        </span>
                        <span className="text-purple-600 ml-3">
                          SPD: {result.pokemon1Stats.speed}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded p-3">
                      <p className="font-semibold mb-2">{result.pokemon2}</p>
                      <div className="space-y-1">
                        <span className="text-blue-600">
                          ATK: {result.pokemon2Stats.attack}
                        </span>
                        <span className="text-green-600 ml-3">
                          DEF: {result.pokemon2Stats.defense}
                        </span>
                        <span className="text-purple-600 ml-3">
                          SPD: {result.pokemon2Stats.speed}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isComplete && !showResults && (
            <div className="text-center py-8">
              <button
                onClick={() => setShowResults(true)}
                className="bg-gradient-to-b from-green-500 to-green-700 text-white font-bold py-4 px-8 rounded-lg border-2 border-green-800 hover:from-green-600 hover:to-green-800 transition-all duration-200 text-lg"
              >
                <Trophy size={24} className="inline mr-2" />
                View Final Results
              </button>
            </div>
          )}
        </div>

        {showResults && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
              <Trophy size={40} className="mr-3 text-yellow-500" />
              Battle Results
            </h2>

            {(() => {
              const results = getFinalResults();
              if (!results) return null;

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
                      <h3 className="text-2xl font-bold text-red-600 mb-4">
                        {battleData.team1Name}
                      </h3>
                      <div className="space-y-3 text-lg">
                        <p>
                          Wins:{' '}
                          <span className="font-bold text-2xl">
                            {results.team1Wins}
                          </span>
                        </p>
                        <p>
                          Survivors:{' '}
                          <span className="font-bold text-2xl">
                            {results.team1Survivors}
                          </span>
                        </p>
                        <p>
                          Defeated:{' '}
                          <span className="font-bold text-2xl">
                            {battleData.team1.length - results.team1Survivors}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h3 className="text-2xl font-bold text-blue-600 mb-4">
                        {battleData.team2Name}
                      </h3>
                      <div className="space-y-3 text-lg">
                        <p>
                          Wins:{' '}
                          <span className="font-bold text-2xl">
                            {results.team2Wins}
                          </span>
                        </p>
                        <p>
                          Survivors:{' '}
                          <span className="font-bold text-2xl">
                            {results.team2Survivors}
                          </span>
                        </p>
                        <p>
                          Defeated:{' '}
                          <span className="font-bold text-2xl">
                            {battleData.team2.length - results.team2Survivors}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-gray-800 mb-6">
                      {results.winner === 'Tie'
                        ? "It's a Tie! 🎭"
                        : `${
                            results.winner === 'Team 1'
                              ? battleData.team1Name
                              : battleData.team2Name
                          } Wins! 🏆`}
                    </h3>

                    <button
                      onClick={handleBackToHome}
                      className="bg-gradient-to-b from-gray-500 to-gray-700 text-white font-bold py-4 px-8 rounded-lg border-2 border-gray-600 hover:from-gray-600 hover:to-gray-800 transition-all duration-200 text-lg"
                    >
                      Back to Team Builder
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
