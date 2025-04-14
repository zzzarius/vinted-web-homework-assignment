import { useEffect, useState } from "react";

export function useFavorites(): {
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
} {
  const [favorites, setFavorites] = useState<number[]>([]);
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

  return { favorites, setFavorites };
}
