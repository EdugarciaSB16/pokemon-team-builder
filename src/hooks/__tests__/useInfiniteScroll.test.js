import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../useInfiniteScroll';

// Mock window event listeners
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('useInfiniteScroll', () => {
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add scroll event listener on mount', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });

  test('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });

  test('should call callback when scrolled to bottom', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock scroll position at bottom
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // The callback is called once on mount and once when we trigger the scroll
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('should not call callback when not at bottom', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock scroll position not at bottom
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // The callback should not be called when not at bottom (only on mount)
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should not call callback when loading', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: true })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock scroll position at bottom
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should call callback when exactly at bottom', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock scroll position exactly at bottom
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // The callback is called once on mount and once when we trigger the scroll
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('should handle edge case with small content', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock small content that fits in viewport
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 400,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // The callback is called once on mount and once when we trigger the scroll
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('should handle zero scroll height', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock zero scroll height
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 0,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // The callback is called once on mount and once when we trigger the scroll
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('should handle zero client height', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock zero client height
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should handle negative scroll values', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock negative scroll values
    Object.defineProperty(window, 'scrollY', { value: -100, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // With negative scroll values: scrollY + innerHeight = -100 + 500 = 400, scrollHeight = 1000, threshold = 200
    // 400 >= 1000 - 200 = 800 is false, so it should not trigger any calls
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  test('should handle multiple scroll events', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockCallback, isLoading: false })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // First scroll - not at bottom
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(mockCallback).not.toHaveBeenCalled();

    // Second scroll - at bottom
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });

    act(() => {
      scrollHandler();
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should handle undefined callback', () => {
    expect(() => {
      renderHook(() =>
        useInfiniteScroll({ onLoadMore: undefined, isLoading: false })
      );
    }).not.toThrow();
  });

  test('should handle null callback', () => {
    expect(() => {
      renderHook(() =>
        useInfiniteScroll({ onLoadMore: null, isLoading: false })
      );
    }).not.toThrow();
  });

  test('should handle custom threshold', () => {
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore: mockCallback,
        isLoading: false,
        threshold: 100,
      })
    );

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // Mock scroll position with custom threshold
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    // With custom threshold of 100: scrollY + innerHeight = 900, scrollHeight = 1000, threshold = 100
    // 900 >= 1000 - 100 = 900 is true, so it should trigger
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
