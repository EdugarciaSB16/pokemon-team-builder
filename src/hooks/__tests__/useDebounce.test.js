import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'changed', delay: 500 });
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });

  test('should cancel previous timeout on new value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'changed1', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    act(() => {
      rerender({ value: 'changed2', delay: 500 });
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe('changed2');
  });

  test('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    act(() => {
      rerender({ value: 'changed', delay: 0 });
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('changed');
  });

  test('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    act(() => {
      rerender({ value: 'changed', delay: 1000 });
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });

  test('should handle multiple rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    // Multiple rapid changes
    act(() => {
      rerender({ value: 'change1', delay: 300 });
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      rerender({ value: 'change2', delay: 300 });
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      rerender({ value: 'final', delay: 300 });
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('final');
  });

  test('should handle cleanup on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'changed', delay: 500 });
    });

    unmount();

    // Should not throw error when timers advance after unmount
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('initial');
  });
});
