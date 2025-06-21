import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BattleSelectionModal from '../BattleSelectionModal';

describe('BattleSelectionModal', () => {
  it('renders the modal with title or content', () => {
    render(
      <MemoryRouter>
        <BattleSelectionModal open={true} onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
