import { useCallback, useEffect, useState } from "react";
import type { Photo } from "../api/Pexels.types";

export function useFavorites(): {
  favorites: Photo[];
  clearFavorites: () => void;
  setFavorite: (photo: Photo) => void;
} {
  const [favorites, setFavorites] = useState<Photo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error parsing favorites from localStorage:", e);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites, mounted]);

  const setFavorite = useCallback((photo: Photo) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.id === photo.id);
      if (isFavorite) {
        return prev.filter((fav) => fav.id !== photo.id);
      }

      return [...prev, photo];
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  }, []);

  return { favorites, clearFavorites, setFavorite };
}
