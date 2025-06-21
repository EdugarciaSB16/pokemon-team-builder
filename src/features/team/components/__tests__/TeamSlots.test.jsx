import React from 'react';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeamSlots from '../TeamSlots';

describe('TeamSlots', () => {
  it('renders the correct number of team slots', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <TeamSlots team={Array(6).fill(null)} />
      </DndProvider>
    );
    const slots = screen.getAllByTestId('team-slot');
    expect(slots).toHaveLength(6);
  });
});
