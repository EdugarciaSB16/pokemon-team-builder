import { useState, useEffect } from 'react';

export function useBattleAnimation(battleData, battleRounds) {
  const [currentRound, setCurrentRound] = useState(0);
  const [displayedBattleRounds, setDisplayedBattleRounds] = useState([]);
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

      setDisplayedBattleRounds((prev) => [...prev, round]);
      setCurrentRound((r) => r + 1);
    };
    animate();
  }, [battleRounds, currentRound, battleData]);

  const handleCloseResults = () => {
    setShowResults(false);
  };

  return {
    currentRound,
    displayedBattleRounds,
    isComplete,
    showResults,
    faintedPokemonA,
    faintedPokemonB,
    battleState,
    handleCloseResults,
  };
}
