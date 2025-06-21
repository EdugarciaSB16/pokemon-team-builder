import React from 'react';
import { render, screen } from '@testing-library/react';
import PokemonCard from '../PokemonCard';

describe('PokemonCard', () => {
  it('renders the pokemon name and type', () => {
    const pokemon = {
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      sprites: {
        front_default: '',
        other: { 'official-artwork': { front_default: '' } },
      },
      stats: [],
    };
    render(<PokemonCard pokemon={pokemon} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
  });
});
