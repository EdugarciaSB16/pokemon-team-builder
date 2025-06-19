// Battle service for handling battle logic and team generation
export class BattleService {
  // Popular Pokémon for random team generation
  static POPULAR_POKEMON = [
    {
      id: 25,
      name: 'pikachu',
      stats: [
        { stat: { name: 'attack' }, base_stat: 55 },
        { stat: { name: 'defense' }, base_stat: 40 },
        { stat: { name: 'speed' }, base_stat: 90 },
      ],
    },
    {
      id: 6,
      name: 'charizard',
      stats: [
        { stat: { name: 'attack' }, base_stat: 84 },
        { stat: { name: 'defense' }, base_stat: 78 },
        { stat: { name: 'speed' }, base_stat: 100 },
      ],
    },
    {
      id: 9,
      name: 'blastoise',
      stats: [
        { stat: { name: 'attack' }, base_stat: 83 },
        { stat: { name: 'defense' }, base_stat: 100 },
        { stat: { name: 'speed' }, base_stat: 78 },
      ],
    },
    {
      id: 150,
      name: 'mewtwo',
      stats: [
        { stat: { name: 'attack' }, base_stat: 110 },
        { stat: { name: 'defense' }, base_stat: 90 },
        { stat: { name: 'speed' }, base_stat: 130 },
      ],
    },
    {
      id: 149,
      name: 'dragonite',
      stats: [
        { stat: { name: 'attack' }, base_stat: 134 },
        { stat: { name: 'defense' }, base_stat: 95 },
        { stat: { name: 'speed' }, base_stat: 80 },
      ],
    },
    {
      id: 3,
      name: 'venusaur',
      stats: [
        { stat: { name: 'attack' }, base_stat: 82 },
        { stat: { name: 'defense' }, base_stat: 83 },
        { stat: { name: 'speed' }, base_stat: 80 },
      ],
    },
    {
      id: 59,
      name: 'arcanine',
      stats: [
        { stat: { name: 'attack' }, base_stat: 110 },
        { stat: { name: 'defense' }, base_stat: 80 },
        { stat: { name: 'speed' }, base_stat: 95 },
      ],
    },
    {
      id: 130,
      name: 'gyarados',
      stats: [
        { stat: { name: 'attack' }, base_stat: 125 },
        { stat: { name: 'defense' }, base_stat: 79 },
        { stat: { name: 'speed' }, base_stat: 81 },
      ],
    },
  ];

  // Generate a random team
  static generateRandomTeam() {
    const shuffled = [...this.POPULAR_POKEMON].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }

  // Get Pokémon stats
  static getPokemonStats(pokemon, statName) {
    return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  }

  // Simulate a single round battle
  static simulateRound(round, team1, team2) {
    const pokemon1 = team1[round];
    const pokemon2 = team2[round];

    // Handle missing Pokémon
    if (!pokemon1 || !pokemon2) {
      return {
        round: round + 1,
        pokemon1: pokemon1?.name || 'None',
        pokemon2: pokemon2?.name || 'None',
        winner: pokemon1 ? 'Team 1' : 'Team 2',
        reason: 'No opponent',
        pokemon1Stats: pokemon1
          ? {
              attack: this.getPokemonStats(pokemon1, 'attack'),
              defense: this.getPokemonStats(pokemon1, 'defense'),
              speed: this.getPokemonStats(pokemon1, 'speed'),
            }
          : null,
        pokemon2Stats: pokemon2
          ? {
              attack: this.getPokemonStats(pokemon2, 'attack'),
              defense: this.getPokemonStats(pokemon2, 'defense'),
              speed: this.getPokemonStats(pokemon2, 'speed'),
            }
          : null,
      };
    }

    const speed1 = this.getPokemonStats(pokemon1, 'speed');
    const speed2 = this.getPokemonStats(pokemon2, 'speed');
    const attack1 = this.getPokemonStats(pokemon1, 'attack');
    const attack2 = this.getPokemonStats(pokemon2, 'attack');
    const defense1 = this.getPokemonStats(pokemon1, 'defense');
    const defense2 = this.getPokemonStats(pokemon2, 'defense');

    // Faster Pokémon attacks first
    if (speed1 > speed2) {
      if (attack1 > defense2) {
        return {
          round: round + 1,
          pokemon1: pokemon1.name,
          pokemon2: pokemon2.name,
          winner: 'Team 1',
          reason: `${pokemon1.name} defeated ${pokemon2.name} with superior attack`,
          pokemon1Stats: { attack: attack1, defense: defense1, speed: speed1 },
          pokemon2Stats: { attack: attack2, defense: defense2, speed: speed2 },
        };
      } else if (attack2 > defense1) {
        return {
          round: round + 1,
          pokemon1: pokemon1.name,
          pokemon2: pokemon2.name,
          winner: 'Team 2',
          reason: `${pokemon2.name} defeated ${pokemon1.name} with superior attack`,
          pokemon1Stats: { attack: attack1, defense: defense1, speed: speed1 },
          pokemon2Stats: { attack: attack2, defense: defense2, speed: speed2 },
        };
      } else {
        return {
          round: round + 1,
          pokemon1: pokemon1.name,
          pokemon2: pokemon2.name,
          winner: 'Team 1',
          reason: `${pokemon1.name} wins due to higher speed`,
          pokemon1Stats: { attack: attack1, defense: defense1, speed: speed1 },
          pokemon2Stats: { attack: attack2, defense: defense2, speed: speed2 },
        };
      }
    } else {
      if (attack2 > defense1) {
        return {
          round: round + 1,
          pokemon1: pokemon1.name,
          pokemon2: pokemon2.name,
          winner: 'Team 2',
          reason: `${pokemon2.name} defeated ${pokemon1.name} with superior attack`,
          pokemon1Stats: { attack: attack1, defense: defense1, speed: speed1 },
          pokemon2Stats: { attack: attack2, defense: defense2, speed: speed2 },
        };
      } else if (attack1 > defense2) {
        return {
          round: round + 1,
          pokemon1: pokemon1.name,
          pokemon2: pokemon2.name,
          winner: 'Team 1',
          reason: `${pokemon1.name} defeated ${pokemon2.name} with superior attack`,
          pokemon1Stats: { attack: attack1, defense: defense1, speed: speed1 },
          pokemon2Stats: { attack: attack2, defense: defense2, speed: speed2 },
        };
      } else {
        return {
          round: round + 1,
          pokemon1: pokemon1.name,
          pokemon2: pokemon2.name,
          winner: 'Team 2',
          reason: `${pokemon2.name} wins due to higher speed`,
          pokemon1Stats: { attack: attack1, defense: defense1, speed: speed1 },
          pokemon2Stats: { attack: attack2, defense: defense2, speed: speed2 },
        };
      }
    }
  }

  // Calculate final battle results
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
}
