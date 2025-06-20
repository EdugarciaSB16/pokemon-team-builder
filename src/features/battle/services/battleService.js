// Battle service for handling battle logic and team generation
export class BattleService {
  // Generate a random team using PokeAPI
  static async generateRandomTeamFromAPI() {
    try {
      // Get total number of Pokemon (up to 1008)
      const totalPokemon = 1008;

      // Generate 6 random IDs between 1 and totalPokemon
      const randomIds = [];
      while (randomIds.length < 6) {
        const randomId = Math.floor(Math.random() * totalPokemon) + 1;
        if (!randomIds.includes(randomId)) {
          randomIds.push(randomId);
        }
      }

      // Fetch Pokemon data for each random ID
      const pokemonPromises = randomIds.map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch Pokemon ${id}`);
        }
        return response.json();
      });

      const pokemonData = await Promise.all(pokemonPromises);

      // Transform the data to match the expected format, keeping only essential data
      return pokemonData.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        sprites: {
          front_default: pokemon.sprites.front_default,
          other: {
            'official-artwork': {
              front_default:
                pokemon.sprites.other?.['official-artwork']?.front_default,
            },
          },
        },
        types: pokemon.types.map((t) => ({ type: { name: t.type.name } })),
        stats: pokemon.stats.map((s) => ({
          base_stat: s.base_stat,
          stat: { name: s.stat.name },
        })),
      }));
    } catch (error) {
      console.error('Error generating random team from API:', error);
      throw error;
    }
  }

  // Clean up battle data from localStorage
  static cleanupBattleData() {
    try {
      localStorage.removeItem('battle-data');
    } catch (error) {
      console.error('Error cleaning up battle data:', error);
    }
  }

  // Get Pokémon stats
  static getPokemonStats(pokemon, statName) {
    return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  }

  // Calculate final battle results (not used in UI, but kept for possible summary)
  static calculateFinalResults(battleResults, team1, team2) {
    const team1Wins = battleResults.filter((r) => r.winner === 'Team 1').length;
    const team2Wins = battleResults.filter((r) => r.winner === 'Team 2').length;
    const team1Survivors = team1.length - team2Wins;
    const team2Survivors = team2.length - team1Wins;

    return {
      team1Wins,
      team2Wins,
      team1Survivors: Math.max(0, team1Survivors),
      team2Survivors: Math.max(0, team2Survivors),
      winner:
        team1Wins > team2Wins
          ? 'Team 1'
          : team2Wins > team1Wins
          ? 'Team 2'
          : 'Tie',
    };
  }

  // Main battle logic: winner keeps fighting
  static simulateFullBattle(team1, team2) {
    let a = 0;
    let b = 0;
    const hpA = Array(team1.length).fill(100);
    const hpB = Array(team2.length).fill(100);
    const rounds = [];
    while (a < team1.length && b < team2.length) {
      const pokeA = team1[a];
      const pokeB = team2[b];
      const atkA = this.getPokemonStats(pokeA, 'attack');
      const defA = this.getPokemonStats(pokeA, 'defense');
      const spdA = this.getPokemonStats(pokeA, 'speed');
      const atkB = this.getPokemonStats(pokeB, 'attack');
      const defB = this.getPokemonStats(pokeB, 'defense');
      const spdB = this.getPokemonStats(pokeB, 'speed');

      let winner = null;
      let loser = null;
      let message = '';

      // Determine who attacks first (higher speed)
      const firstAttacker = spdA > spdB ? 'A' : spdB > spdA ? 'B' : 'A';

      if (firstAttacker === 'A') {
        // A attacks first
        if (atkA > defB) {
          // A defeats B with superior attack
          hpB[b] = 0;
          winner = 'A';
          loser = 'B';
          message = `${pokeA.name} defeated ${pokeB.name} with superior attack`;
        } else {
          // A's attack didn't defeat B, so B gets to attack
          if (atkB > defA) {
            // B defeats A with superior attack
            hpA[a] = 0;
            winner = 'B';
            loser = 'A';
            message = `${pokeB.name} defeated ${pokeA.name} with superior attack`;
          } else {
            // Neither can defeat the other, faster one wins (A)
            hpB[b] = 0;
            winner = 'A';
            loser = 'B';
            message = `${pokeA.name} wins due to higher speed`;
          }
        }
      } else {
        // B attacks first
        if (atkB > defA) {
          // B defeats A with superior attack
          hpA[a] = 0;
          winner = 'B';
          loser = 'A';
          message = `${pokeB.name} defeated ${pokeA.name} with superior attack`;
        } else {
          // B's attack didn't defeat A, so A gets to attack
          if (atkA > defB) {
            // A defeats B with superior attack
            hpB[b] = 0;
            winner = 'A';
            loser = 'B';
            message = `${pokeA.name} defeated ${pokeB.name} with superior attack`;
          } else {
            // Neither can defeat the other, faster one wins (B)
            hpA[a] = 0;
            winner = 'B';
            loser = 'A';
            message = `${pokeB.name} wins due to higher speed`;
          }
        }
      }

      rounds.push({
        round: rounds.length + 1,
        pokemonA: pokeA,
        pokemonB: pokeB,
        winner,
        loser,
        message,
        hpA: [...hpA],
        hpB: [...hpB],
        a,
        b,
      });

      // Winner continues fighting, loser's team moves to next Pokemon
      if (winner === 'A') {
        b++;
      } else {
        a++;
      }
    }
    return {
      rounds,
      hpA,
      hpB,
      survivorsA: hpA.filter((hp) => hp > 0).length,
      survivorsB: hpB.filter((hp) => hp > 0).length,
      defeatedA: hpA.filter((hp) => hp === 0).length,
      defeatedB: hpB.filter((hp) => hp === 0).length,
    };
  }
}
