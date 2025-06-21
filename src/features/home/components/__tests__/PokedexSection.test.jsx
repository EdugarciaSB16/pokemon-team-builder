import React from 'react';
import { render, screen } from '@testing-library/react';
import PokedexSection from '../PokedexSection';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the usePokemonList hook
jest.mock('@/features/pokemon/hooks/usePokemonList', () => ({
  usePokemonList: jest.fn(() => ({
    data: [{ name: 'bulbasaur', id: 1 }],
    isLoading: false,
    isError: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
  })),
}));

describe('PokedexSection', () => {
  it('renders the pokedex section', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <PokedexSection />
      </QueryClientProvider>
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });
});
