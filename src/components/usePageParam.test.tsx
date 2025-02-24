import { renderHook, act } from '@testing-library/react';
import { usePageParam } from './usePageParam';

describe('usePageParam', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost'),
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('initializes with page 1 when no URL parameter is present', () => {
    const { result } = renderHook(() => usePageParam());
    expect(result.current.page).toBe(1);
  });

  it('initializes with correct page from URL parameter', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost?page=3'),
      writable: true,
    });

    const { result } = renderHook(() => usePageParam());
    expect(result.current.page).toBe(3);
  });

  it('increments page with nextPage', () => {
    const { result } = renderHook(() => usePageParam());

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
  });

  it('decrements page with prevPage but not below 1', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost?page=2'),
      writable: true,
    });

    const { result } = renderHook(() => usePageParam());

    act(() => {
      result.current.prevPage();
    });
    expect(result.current.page).toBe(1);

    act(() => {
      result.current.prevPage();
    });
    expect(result.current.page).toBe(1); // Should not go below 1
  });

  it('handles invalid page parameter in URL', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost?page=invalid'),
      writable: true,
    });

    const { result } = renderHook(() => usePageParam());
    expect(result.current.page).toBe(1);
  });
});
