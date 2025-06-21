import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useTeamActions } from '../../hooks/useTeamActions';
import { useTeamStore } from '../../store';

jest.mock('../../store', () => ({
  useTeamStore: jest.fn(),
}));

describe('useTeamActions', () => {
  const mockStore = {
    slots: Array(6).fill(null),
    isDraft: false,
    randomizeTeam: jest.fn(),
    sortByAttack: jest.fn(),
    saveTeam: jest.fn(),
    discardDraft: jest.fn(),
  };

  beforeEach(() => {
    useTeamStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });
    jest.clearAllMocks();
  });

  test('should provide team actions', () => {
    const { result } = renderHook(() => useTeamActions());

    expect(result.current).toHaveProperty('randomizeTeam');
    expect(result.current).toHaveProperty('sortByAttack');
    expect(result.current).toHaveProperty('saveTeam');
    expect(result.current).toHaveProperty('discardDraft');
    expect(result.current).toHaveProperty('isDraft');
    expect(result.current).toHaveProperty('team');
    expect(result.current).toHaveProperty('isTeamEmpty');
  });

  test('should return isTeamEmpty as true when all slots are null', () => {
    mockStore.slots = Array(6).fill(null);

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isTeamEmpty).toBe(true);
  });

  test('should return isTeamEmpty as false when any slot has pokemon', () => {
    mockStore.slots = [{ id: 1 }, null, null, null, null, null];

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isTeamEmpty).toBe(false);
  });

  test('should return isTeamEmpty as false when all slots have pokemon', () => {
    mockStore.slots = Array(6).fill({ id: 1 });

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isTeamEmpty).toBe(false);
  });

  test('should call randomizeTeam when action is triggered', () => {
    const { result } = renderHook(() => useTeamActions());

    act(() => {
      result.current.randomizeTeam();
    });

    expect(mockStore.randomizeTeam).toHaveBeenCalledTimes(1);
  });

  test('should call sortByAttack when action is triggered', () => {
    const { result } = renderHook(() => useTeamActions());

    act(() => {
      result.current.sortByAttack();
    });

    expect(mockStore.sortByAttack).toHaveBeenCalledTimes(1);
  });

  test('should call saveTeam when action is triggered', () => {
    const { result } = renderHook(() => useTeamActions());

    act(() => {
      result.current.saveTeam('Test Team');
    });

    expect(mockStore.saveTeam).toHaveBeenCalledWith('Test Team');
  });

  test('should call discardDraft when action is triggered', () => {
    const { result } = renderHook(() => useTeamActions());

    act(() => {
      result.current.discardDraft();
    });

    expect(mockStore.discardDraft).toHaveBeenCalledTimes(1);
  });

  test('should return current isDraft state', () => {
    mockStore.isDraft = true;

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isDraft).toBe(true);
  });

  test('should return current team slots', () => {
    const mockSlots = [{ id: 1 }, { id: 2 }, null, null, null, null];
    mockStore.slots = mockSlots;

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.team).toEqual(mockSlots);
  });

  test('should update isTeamEmpty when slots change', () => {
    // Start with empty team
    mockStore.slots = Array(6).fill(null);

    const { result, rerender } = renderHook(() => useTeamActions());
    expect(result.current.isTeamEmpty).toBe(true);

    // Update slots to have a pokemon
    mockStore.slots = [{ id: 1 }, null, null, null, null, null];

    rerender();
    expect(result.current.isTeamEmpty).toBe(false);
  });

  test('should handle mixed slot states correctly', () => {
    mockStore.slots = [{ id: 1 }, null, { id: 2 }, null, { id: 3 }, null];

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isTeamEmpty).toBe(false);
    expect(result.current.team).toHaveLength(6);
    expect(result.current.team[0]).toEqual({ id: 1 });
    expect(result.current.team[1]).toBeNull();
    expect(result.current.team[2]).toEqual({ id: 2 });
  });

  test('should handle edge case with empty array', () => {
    mockStore.slots = [];

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isTeamEmpty).toBe(true);
    expect(result.current.team).toEqual([]);
  });

  test('should handle edge case with partial array', () => {
    mockStore.slots = [{ id: 1 }, { id: 2 }];

    const { result } = renderHook(() => useTeamActions());

    expect(result.current.isTeamEmpty).toBe(false);
    expect(result.current.team).toHaveLength(2);
  });
});
