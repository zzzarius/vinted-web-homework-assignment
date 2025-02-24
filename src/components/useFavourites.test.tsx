import { renderHook, act } from '@testing-library/react';
import { useFavourites } from './useFavourites';

describe('useFavourites', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with empty favourites array', () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([]);
  });

  it('loads favourites from localStorage if available', () => {
    const storedFavourites = [1, 2, 3];
    window.localStorage.setItem('favourites', JSON.stringify(storedFavourites));

    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual(storedFavourites);
  });

  it('updates favourites and persists to localStorage', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.setFavourites([1, 2, 3]);
    });

    expect(result.current.favourites).toEqual([1, 2, 3]);
    expect(JSON.parse(window.localStorage.getItem('favourites') || '[]')).toEqual([1, 2, 3]);
  });

});
