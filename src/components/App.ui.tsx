import { useEffect, useRef, useState } from "react";
import { getCuratedPhotos } from "../api/Pexels.api";
import type { Photo } from "../api/Pexels.types";
import { Card } from "./Card/Card.ui";
import { LoadingIndicator } from "./LoadingIndicator";
import { useFavorites } from "./useFavorites";
import { usePageParam } from "./usePageParam";

import styles from "./App.module.css";

function App() {
  const { page, nextPage, prevPage } = usePageParam();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<unknown[]>([]);
  const { favorites, setFavorites } = useFavorites();

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
      if (fetching || fetchedPages.current.has(page) || page < 1) {
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
        setPhotos((prev) => {
          return [...prev, ...data.photos];
        });
        fetchedPages.current.add(page);
      }
      setFetching(false);
      history.pushState({ page }, "", new URL(`?page=${page}`, location.href));
    }

    getData();
  }, [page, prevPage, fetching]);

  useEffect(() => {
    if (page < 1) {
      return;
    }

    const currentBottomRef = bottomRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetching) {
          nextPage();
        }
      },
      { threshold: 0.5, rootMargin: "100px" },
    );
    if (currentBottomRef) {
      observer.observe(currentBottomRef);
    }

    return () => {
      if (currentBottomRef) {
        observer.unobserve(currentBottomRef);
      }
    };
  }, [fetching, nextPage, page]);

  return (
    <div className={styles.app}>
      <ul className={styles.photoGrid}>
        {photos.map((photo, idx) => {
          const isFavorites = favorites.includes(photo.id);
          return (
            <Card
              key={photo.id}
              photo={photo}
              idx={idx}
              isFavorites={isFavorites}
              setFavorites={setFavorites}
            />
          );
        })}
      </ul>
      {photos.length > 0 && <LoadingIndicator />}
      <div style={{ display: !fetching ? "block" : "none" }} ref={bottomRef} />
    </div>
  );
}

export default App;
