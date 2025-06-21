import React from 'react';
import Header from '@/features/home/components/Header';
import BattleArena from '@/features/battle/components/BattleArena';
import TeamStatus from '@/features/battle/components/TeamStatus';
import BattleHistory from '@/features/battle/components/BattleHistory';
import BattleResults from '@/features/battle/components/BattleResults';
import BattleControls from '@/features/battle/components/BattleControls';
import { useBattleData } from '@/features/battle/hooks/useBattleData';
import { useBattleAnimation } from '@/features/battle/hooks/useBattleAnimation';

export default function Battle() {
  const {
    battleData,
    battleRounds,
    handleBackToHome,
    getPokemonImage,
    getPokemonStats,
  } = useBattleData();

  const {
    currentRound,
    displayedBattleRounds,
    isComplete,
    showResults,
    faintedPokemonA,
    faintedPokemonB,
    battleState,
    handleCloseResults,
  } = useBattleAnimation(battleData, battleRounds);

  if (!battleData || battleRounds.length === 0) return null;

  // Get current pokes for animation
  const round = battleRounds[Math.min(currentRound, battleRounds.length - 1)];
  const pokeA = round.pokemonA;
  const pokeB = round.pokemonB;

  // Final results - Calculate survivors correctly
  const survivorsA = battleData.team1.length - faintedPokemonA.size;
  const survivorsB = battleData.team2.length - faintedPokemonB.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Header title="BATTLE ARENA" />
      <BattleControls onBackToHome={handleBackToHome} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <BattleArena
          pokeA={pokeA}
          pokeB={pokeB}
          battleState={battleState}
          getPokemonImage={getPokemonImage}
          getPokemonStats={getPokemonStats}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TeamStatus
            team={battleData.team1}
            teamName={battleData.team1Name}
            faintedPokemon={faintedPokemonA}
            getPokemonImage={getPokemonImage}
            getPokemonStats={getPokemonStats}
            teamColor="red"
          />

          <BattleHistory
            displayedBattleRounds={displayedBattleRounds}
            battleData={battleData}
          />

          <TeamStatus
            team={battleData.team2}
            teamName={battleData.team2Name}
            faintedPokemon={faintedPokemonB}
            getPokemonImage={getPokemonImage}
            getPokemonStats={getPokemonStats}
            teamColor="blue"
          />
        </div>

        <BattleResults
          isComplete={isComplete}
          showResults={showResults}
          survivorsA={survivorsA}
          survivorsB={survivorsB}
          battleData={battleData}
          onClose={handleCloseResults}
          onBackToHome={handleBackToHome}
        />
      </div>
    </div>
  );
}
