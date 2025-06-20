import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BattleService } from '@/features/battle/services/battleService';
import {
  ArrowLeft,
  Swords,
  Shield,
  Trophy,
  Users,
  Zap,
  Heart,
  Target,
  Shield as ShieldIcon,
  X,
} from 'lucide-react';
import PokemonImage from '@/features/pokemon/components/PokemonImage';
import Header from '@/features/home/components/Header';

export default function Battle() {
  const navigate = useNavigate();
  const location = useLocation();
  const [battleData, setBattleData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [battleRounds, setBattleRounds] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [faintedPokemonA, setFaintedPokemonA] = useState(new Set());
  const [faintedPokemonB, setFaintedPokemonB] = useState(new Set());
  const [battleState, setBattleState] = useState({
    pokemonAHP: 100,
    pokemonBHP: 100,
    currentAnimation: null,
    battleText: '',
  });

  // Load battle data from navigation state or localStorage
  useEffect(() => {
    if (!battleData) {
      if (location.state?.battleData) {
        setBattleData(location.state.battleData);
        return;
      }

      const data = localStorage.getItem('battle-data');
      if (!data) {
        navigate('/');
        return;
      }

      try {
        const parsedData = JSON.parse(data);
        setBattleData(parsedData);
      } catch (parseError) {
        console.error('Error parsing battle data:', parseError);
        navigate('/');
      }
    }
  }, [navigate, battleData, location.state]);

  // Cleanup battle data on unmount
  useEffect(() => {
    return () => {
      BattleService.cleanupBattleData();
    };
  }, []);

  // Get Pokemon image URL
  const getPokemonImage = (pokemon) => {
    return (
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '/pokeball.svg'
    );
  };

  // Get Pokemon stats
  const getPokemonStats = (pokemon) => {
    if (!pokemon.stats) return null;

    const stats = {};
    pokemon.stats.forEach((stat) => {
      stats[stat.stat.name] = stat.base_stat;
    });

    return {
      hp: stats.hp || 0,
      attack: stats.attack || 0,
      defense: stats.defense || 0,
      speed: stats.speed || 0,
      specialAttack: stats['special-attack'] || 0,
      specialDefense: stats['special-defense'] || 0,
    };
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
        setShowResults(true);
      }
      return;
    }

    const round = battleRounds[currentRound];
    const {
      pokemonA: pokeA,
      pokemonB: pokeB,
      winner,
      loser,
      message,
      a,
      b,
    } = round;

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

      // Update fainted state after damage animation
      if (loser === 'A') {
        setFaintedPokemonA((prev) => new Set(prev).add(a));
      } else {
        setFaintedPokemonB((prev) => new Set(prev).add(b));
      }

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

  const handleCloseResults = () => {
    setShowResults(false);
  };

  if (!battleData || battleRounds.length === 0) return null;

  // Get current pokes for animation
  const round = battleRounds[Math.min(currentRound, battleRounds.length - 1)];
  const pokeA = round.pokemonA;
  const pokeB = round.pokemonB;

  // Final results - Calculate survivors correctly
  const survivorsA = battleData.team1.length - faintedPokemonA.size;
  const survivorsB = battleData.team2.length - faintedPokemonB.size;

  // Get stats for current battling Pokémon
  const statsA = getPokemonStats(pokeA);
  const statsB = getPokemonStats(pokeB);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Header title="BATTLE ARENA" />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-xs md:text-sm font-bold rounded-lg border-2 border-blue-700 shadow-md hover:from-blue-500 hover:to-blue-700 active:translate-y-0.5 transition-all duration-200 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Team Builder
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative flex flex-col lg:block bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-2xl p-4 md:p-8 mb-8 min-h-[600px] overflow-hidden border-4 border-green-200">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-200/20"></div>
          <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400/20 rounded-full"></div>
          <div className="absolute top-8 right-8 w-12 h-12 bg-blue-400/20 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-20 h-20 bg-red-400/20 rounded-full"></div>

          {/* Opponent Pokemon (Top on mobile, right on desktop) */}
          <div className="relative lg:absolute lg:top-8 lg:right-8 w-full lg:w-80 mx-auto order-1">
            {pokeB && (
              <div
                className={`transition-all duration-500 mx-auto w-full max-w-sm lg:max-w-none ${
                  battleState.currentAnimation === 'attack' &&
                  battleState.battleText.includes(pokeB.name)
                    ? 'lg:-translate-x-16'
                    : ''
                }`}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 md:p-4 mb-4 shadow-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg capitalize text-blue-700">
                      {pokeB.name}
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      Lv. 50
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        HP
                      </span>
                      <span className="text-sm font-bold">
                        {battleState.pokemonBHP}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg"
                        style={{ width: `${battleState.pokemonBHP}%` }}
                      />
                    </div>
                  </div>
                  {statsB && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-red-500" />
                        <span className="font-medium">HP:</span>
                        <span className="text-gray-600">{statsB.hp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={12} className="text-orange-500" />
                        <span className="font-medium">ATK:</span>
                        <span className="text-gray-600">{statsB.attack}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldIcon size={12} className="text-blue-500" />
                        <span className="font-medium">DEF:</span>
                        <span className="text-gray-600">{statsB.defense}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-yellow-500" />
                        <span className="font-medium">SPD:</span>
                        <span className="text-gray-600">{statsB.speed}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-50"></div>
                  <PokemonImage
                    src={getPokemonImage(pokeB)}
                    alt={pokeB.name}
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      battleState.currentAnimation === 'damage' &&
                      battleState.battleText.includes(pokeB.name)
                        ? 'animate-shake scale-110'
                        : ''
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Player Pokemon (Bottom on mobile, left on desktop) */}
          <div className="relative lg:absolute lg:bottom-8 lg:left-8 w-full lg:w-80 mx-auto order-3 lg:order-2">
            {pokeA && (
              <div
                className={`transition-all duration-500 mx-auto w-full max-w-sm lg:max-w-none ${
                  battleState.currentAnimation === 'attack' &&
                  battleState.battleText.includes(pokeA.name)
                    ? 'lg:translate-x-16'
                    : ''
                }`}
              >
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-50"></div>
                  <PokemonImage
                    src={getPokemonImage(pokeA)}
                    alt={pokeA.name}
                    className={`w-full h-full object-contain transform scale-x-[-1] transition-all duration-300 ${
                      battleState.currentAnimation === 'damage' &&
                      battleState.battleText.includes(pokeA.name)
                        ? 'animate-shake scale-110'
                        : ''
                    }`}
                  />
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 md:p-4 mt-4 shadow-xl border-2 border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg capitalize text-red-700">
                      {pokeA.name}
                    </span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                      Lv. 50
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        HP
                      </span>
                      <span className="text-sm font-bold">
                        {battleState.pokemonAHP}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg"
                        style={{ width: `${battleState.pokemonAHP}%` }}
                      />
                    </div>
                  </div>
                  {statsA && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-red-500" />
                        <span className="font-medium">HP:</span>
                        <span className="text-gray-600">{statsA.hp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={12} className="text-orange-500" />
                        <span className="font-medium">ATK:</span>
                        <span className="text-gray-600">{statsA.attack}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldIcon size={12} className="text-blue-500" />
                        <span className="font-medium">DEF:</span>
                        <span className="text-gray-600">{statsA.defense}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-yellow-500" />
                        <span className="font-medium">SPD:</span>
                        <span className="text-gray-600">{statsA.speed}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Battle Text */}
          <div className="relative lg:absolute lg:bottom-8 left-0 right-0 mx-auto w-full max-w-lg lg:w-[600px] order-2 lg:order-3 my-4 lg:my-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl border-2 border-gray-200">
              <p className="text-lg md:text-xl font-bold text-gray-800 text-center">
                {battleState.battleText}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-red-200">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <Users size={24} className="text-red-600" />
              </div>
              {battleData.team1Name}
            </h2>
            <div className="space-y-3">
              {battleData.team1.map((pokemon, index) => {
                const stats = getPokemonStats(pokemon);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      faintedPokemonA.has(index)
                        ? 'bg-red-50 border-2 border-red-300 opacity-60'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                        <PokemonImage
                          src={getPokemonImage(pokemon)}
                          alt={pokemon.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold capitalize text-gray-800">
                          {pokemon.name}
                        </span>
                        {faintedPokemonA.has(index) ? (
                          <span className="ml-2 text-red-600 font-bold">
                            ✗ FAINTED
                          </span>
                        ) : (
                          <span className="ml-2 text-green-600 font-bold">
                            ✓ ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                    {stats && (
                      <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
                        <div>HP: {stats.hp}</div>
                        <div>ATK: {stats.attack}</div>
                        <div>SPD: {stats.speed}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-gray-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Swords size={24} className="text-gray-600" />
              </div>
              Battle History
            </h2>
            <div className="space-y-3 max-h-[40vh] lg:max-h-[600px] overflow-y-auto pr-2">
              {battleRounds.map((result, index) => (
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
                  <p className="text-gray-600 leading-relaxed">
                    {result.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              {battleData.team2Name}
            </h2>
            <div className="space-y-3">
              {battleData.team2.map((pokemon, index) => {
                const stats = getPokemonStats(pokemon);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      faintedPokemonB.has(index)
                        ? 'bg-blue-50 border-2 border-blue-300 opacity-60'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                        <PokemonImage
                          src={getPokemonImage(pokemon)}
                          alt={pokemon.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold capitalize text-gray-800">
                          {pokemon.name}
                        </span>
                        {faintedPokemonB.has(index) ? (
                          <span className="ml-2 text-red-600 font-bold">
                            ✗ FAINTED
                          </span>
                        ) : (
                          <span className="ml-2 text-green-600 font-bold">
                            ✓ ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                    {stats && (
                      <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
                        <div>HP: {stats.hp}</div>
                        <div>ATK: {stats.attack}</div>
                        <div>SPD: {stats.speed}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {isComplete && showResults && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300 max-w-2xl w-full relative">
              <button
                onClick={handleCloseResults}
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
                <p className="text-gray-600">
                  The epic battle has come to an end
                </p>
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
                  onClick={handleBackToHome}
                  className="px-6 py-3 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-sm font-bold rounded-lg border-2 border-blue-700 shadow-md hover:from-blue-500 hover:to-blue-700 active:translate-y-0.5 transition-all duration-200"
                >
                  Return to Team Builder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
