import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BattleService } from '@/features/battle/services/battleService';
import { ArrowLeft, Swords, Shield, Trophy, Users } from 'lucide-react';
import PokemonImage from '@/features/pokemon/components/PokemonImage';

export default function Battle() {
  const navigate = useNavigate();
  const [battleData, setBattleData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [battleRounds, setBattleRounds] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [battleState, setBattleState] = useState({
    pokemonAHP: 100,
    pokemonBHP: 100,
    currentAnimation: null,
    battleText: '',
  });

  // Load battle data only if not in memory
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

  // Get Pokemon image URL
  const getPokemonImage = (pokemon) => {
    return (
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '/pokeball.svg'
    );
  };

  // Simulate the full battle once at the start
  useEffect(() => {
    if (battleData) {
      const result = BattleService.simulateFullBattle(
        battleData.team1,
        battleData.team2
      );
      setBattleRounds(result.rounds);
    }
  }, [battleData]);

  // Animate each round
  useEffect(() => {
    if (
      !battleData ||
      battleRounds.length === 0 ||
      currentRound >= battleRounds.length
    ) {
      if (battleRounds.length > 0 && currentRound >= battleRounds.length) {
        setIsComplete(true);
      }
      return;
    }

    const round = battleRounds[currentRound];
    const pokeA = round.pokemonA;
    const pokeB = round.pokemonB;
    const winner = round.winner;
    const loser = round.loser;
    const message = round.message;

    const animate = async () => {
      // Start round
      setBattleState((prev) => ({
        ...prev,
        pokemonAHP: 100,
        pokemonBHP: 100,
        currentAnimation: null,
        battleText: `Round ${round.round}: ${pokeA.name} vs ${pokeB.name}`,
      }));
      await new Promise((res) => setTimeout(res, 1500));

      // Who attacks first
      let first;
      if (winner === 'A') {
        first = pokeA;
      } else {
        first = pokeB;
      }
      setBattleState((prev) => ({
        ...prev,
        currentAnimation: 'attack',
        battleText: `${first.name} attacks first!`,
      }));
      await new Promise((res) => setTimeout(res, 1200));

      // Damage animation
      if (loser === 'A') {
        setBattleState((prev) => ({
          ...prev,
          pokemonAHP: 0,
          currentAnimation: 'damage',
          battleText: message,
        }));
      } else {
        setBattleState((prev) => ({
          ...prev,
          pokemonBHP: 0,
          currentAnimation: 'damage',
          battleText: message,
        }));
      }
      await new Promise((res) => setTimeout(res, 1500));

      // End round
      setBattleState((prev) => ({
        ...prev,
        currentAnimation: null,
        battleText: `${message}`,
      }));
      await new Promise((res) => setTimeout(res, 1000));

      setCurrentRound((r) => r + 1);
    };
    animate();
  }, [battleRounds, currentRound, battleData]);

  const handleBackToHome = () => {
    localStorage.removeItem('battle-data');
    navigate('/');
  };

  if (!battleData || battleRounds.length === 0) return null;

  // Get current pokes for animation
  const round = battleRounds[Math.min(currentRound, battleRounds.length - 1)];
  const pokeA = round.pokemonA;
  const pokeB = round.pokemonB;

  // For team lists, show fainted status
  const faintedA = new Set(
    battleRounds.filter((r) => r.loser === 'A').map((r) => r.a)
  );
  const faintedB = new Set(
    battleRounds.filter((r) => r.loser === 'B').map((r) => r.b)
  );

  // Final results
  const survivorsA =
    battleRounds.length > 0
      ? battleRounds[0].hpA.filter((hp) => hp > 0).length
      : 0;
  const survivorsB =
    battleRounds.length > 0
      ? battleRounds[0].hpB.filter((hp) => hp > 0).length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
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
        <div className="relative bg-gradient-to-b from-green-100 to-green-200 rounded-xl shadow-2xl p-8 mb-8 min-h-[500px] overflow-hidden">
          <div className="absolute bottom-4 left-12 w-64">
            {pokeA && (
              <div
                className={`transition-all duration-300 ${
                  battleState.currentAnimation === 'attack' &&
                  battleState.battleText.includes(pokeA.name)
                    ? 'translate-x-12'
                    : ''
                }`}
              >
                <div className="bg-white/90 rounded-lg p-3 mb-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold capitalize">{pokeA.name}</span>
                    <span className="text-sm">Lv. 50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-green-300"
                      style={{ width: `${battleState.pokemonAHP}%` }}
                    />
                  </div>
                  <div className="text-right text-sm mt-1">
                    {battleState.pokemonAHP}/100 HP
                  </div>
                </div>
                <div className="relative w-48 h-48">
                  <PokemonImage
                    src={getPokemonImage(pokeA)}
                    alt={pokeA.name}
                    className={`w-full h-full object-contain transform scale-x-[-1] ${
                      battleState.currentAnimation === 'damage' &&
                      battleState.battleText.includes(pokeA.name)
                        ? 'animate-shake'
                        : ''
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-12 w-64">
            {pokeB && (
              <div
                className={`transition-all duration-300 ${
                  battleState.currentAnimation === 'attack' &&
                  battleState.battleText.includes(pokeB.name)
                    ? '-translate-x-12'
                    : ''
                }`}
              >
                <div className="bg-white/90 rounded-lg p-3 mb-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold capitalize">{pokeB.name}</span>
                    <span className="text-sm">Lv. 50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-green-300"
                      style={{ width: `${battleState.pokemonBHP}%` }}
                    />
                  </div>
                  <div className="text-right text-sm mt-1">
                    {battleState.pokemonBHP}/100 HP
                  </div>
                </div>
                <div className="relative w-48 h-48">
                  <PokemonImage
                    src={getPokemonImage(pokeB)}
                    alt={pokeB.name}
                    className={`w-full h-full object-contain ${
                      battleState.currentAnimation === 'damage' &&
                      battleState.battleText.includes(pokeB.name)
                        ? 'animate-shake'
                        : ''
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-0 right-0 mx-auto w-[500px]">
            <div className="bg-white/95 rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <p className="text-lg font-pixel text-gray-800">
                {battleState.battleText}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-red-200">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
              <Users size={24} className="mr-2" />
              {battleData.team1Name}
            </h2>
            <div className="space-y-2">
              {battleData.team1.map((pokemon, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    faintedA.has(index)
                      ? 'bg-red-100 border-2 border-red-300 opacity-60'
                      : ''
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <PokemonImage
                      src={getPokemonImage(pokemon)}
                      alt={pokemon.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="font-medium capitalize">{pokemon.name}</span>
                  {faintedA.has(index) && (
                    <span className="text-red-600">✗</span>
                  )}
                  {!faintedA.has(index) && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Swords size={24} className="mr-2" />
              Battle History
            </h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {battleRounds.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    result.winner === 'A'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Round {result.round}</span>
                    <span
                      className={
                        result.winner === 'A' ? 'text-red-600' : 'text-blue-600'
                      }
                    >
                      {result.winner === 'A'
                        ? battleData.team1Name
                        : battleData.team2Name}
                    </span>
                  </div>
                  <p className="text-gray-600">{result.message}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
              <Users size={24} className="mr-2" />
              {battleData.team2Name}
            </h2>
            <div className="space-y-2">
              {battleData.team2.map((pokemon, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    faintedB.has(index)
                      ? 'bg-blue-100 border-2 border-blue-300 opacity-60'
                      : ''
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <PokemonImage
                      src={getPokemonImage(pokemon)}
                      alt={pokemon.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="font-medium capitalize">{pokemon.name}</span>
                  {faintedB.has(index) && (
                    <span className="text-red-600">✗</span>
                  )}
                  {!faintedB.has(index) && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {isComplete && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-lg border-2 border-yellow-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-yellow-600">
              <Trophy size={32} className="mr-3" />
              Final Results
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div
                className={`p-4 rounded-lg ${
                  survivorsA > survivorsB ? 'bg-red-100' : 'bg-gray-100'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">
                  {battleData.team1Name}
                </h3>
                <p>Remaining Pokémon: {survivorsA}</p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  survivorsB > survivorsA ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">
                  {battleData.team2Name}
                </h3>
                <p>Remaining Pokémon: {survivorsB}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
