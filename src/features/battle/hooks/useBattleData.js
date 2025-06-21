import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BattleService } from '../services/battleService';

export function useBattleData() {
  const navigate = useNavigate();
  const location = useLocation();
  const [battleData, setBattleData] = useState(null);
  const [battleRounds, setBattleRounds] = useState([]);

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

  const handleBackToHome = () => {
    localStorage.removeItem('battle-data');
    navigate('/');
  };

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

  return {
    battleData,
    battleRounds,
    handleBackToHome,
    getPokemonImage,
    getPokemonStats,
  };
}
