import { useEffect, useState } from "react";

export function useFavourites(): {
    favourites: number[];
    setFavourites: React.Dispatch<React.SetStateAction<number[]>>;
} {
    const [favourites, setFavourites] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      try {
        const stored = localStorage.getItem("favourites");
        if (stored) {
          setFavourites(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error parsing favourites from localStorage:', e);
        setFavourites([]);
      }
    }, []);

    useEffect(() => {
      if (!mounted) return;
      localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

    return { favourites, setFavourites };
}