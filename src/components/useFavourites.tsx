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
      setFavourites(JSON.parse(localStorage.getItem("favourites") || "[]"));
    }, []);
  
    useEffect(() => {
      if (!mounted) return;
      localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);
    
    return { favourites, setFavourites };
}