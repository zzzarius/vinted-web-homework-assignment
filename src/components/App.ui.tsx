import { useEffect, useRef, useState } from "react";
import { getCuratedPhotos } from "../api/Pexels.api";
import { Photo } from "../api/Pexels.types";
import { LoadingIndicator } from "./LoadingIndicator";
import { Card } from "./Card/Card.ui";
import { useFavourites } from "./useFavourites";
import { usePageParam } from "./usePageParam";

import styles from "./App.module.css";

function App() {
  const { page, nextPage, prevPage } = usePageParam();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<unknown[]>([]);
  const { favourites, setFavourites } = useFavourites();

  const [fetching, setFetching] = useState(false);
  const fetchedPages = useRef(new Set<number>(new Set([Number(page)])));
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0) {
      console.log(errors);
      setErrors([]);
    }
  }, [errors]);

  useEffect(() => {
    async function getData() {
      if (fetchedPages.current.has(page) || page < 1) {
        return;
      }
      setFetching(true);
      const { data, errors, hasErrors } = await getCuratedPhotos(page);

      if (hasErrors) {
        setErrors(errors);
        fetchedPages.current.delete(page);
        prevPage();
        setFetching(false);
        return;
      }
      if (data?.photos) {
        setPhotos(prev => [...prev, ...data.photos]);
        fetchedPages.current.add(page);
      }
      setFetching(false);
      history.pushState({ page }, "", new URL(`?page=${page}`, location.href));
    }

    getData();
  }, [page]);

  useEffect(() => {
    if (page < 1) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetching) {
          nextPage();
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [page]);

  return (
    <div className={styles.app}>
      <ul className={styles.photoGrid}>
        {photos.map((photo, idx) => {
          const isFavourite = favourites.includes(photo.id);
          return (
            <Card
              key={photo.id}
              photo={photo}
              idx={idx}
              isFavourite={isFavourite}
              setFavourites={setFavourites}
            />
          )
        })}
      </ul>
      {photos.length > 0 && <LoadingIndicator />}
      <div style={{ display: !fetching ? "block" : "none" }} ref={bottomRef} />
    </div>
  );
}

export default App;
