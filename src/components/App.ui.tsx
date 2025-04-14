import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";
import { getCuratedPhotos } from "../api/Pexels.api";
import type { Photo } from "../api/Pexels.types";
import { Card } from "./Card";
import { Favorites } from "./Favorites";
import { LoadingIndicator } from "./LoadingIndicator";
import { useFavorites } from "./useFavorites";
import { usePageParam } from "./usePageParam";

import styles from "./App.module.css";
import { PreviewDialog } from "./PreviewDialog";

function App() {
  const { page, nextPage, prevPage } = usePageParam();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<unknown[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const { favorites, setFavorite, clearFavorites } = useFavorites();
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
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
          const uniquePhotoIds = new Set(prev.map((photo) => photo.id));
          const uniquePhotos = data.photos.filter(
            (photo) => !uniquePhotoIds.has(photo.id),
          );
          return [...prev, ...uniquePhotos];
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

  async function handleDownloadAll() {
    setIsDownloading(true);
    const zip = new JSZip();
    const folder = zip.folder("collection");
    await Promise.allSettled(
      favorites.map(async (photo) => {
        const imageUrl = photo.src.original;
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        /* Add the image to the folder */
        folder?.file(`${photo.id}.jpg`, imageBlob);
      }),
    );
    const content = await folder?.generateAsync({ type: "blob" });
    if (content) {
      saveAs(content, "files");
      setIsDownloading(false);
    } else {
      console.error("Failed to generate zip content.");
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPreviewPhoto(null);
      }
      if (!previewPhoto) {
        return;
      }
      const previewPhotoIndex = photos.indexOf(previewPhoto);
      if (previewPhotoIndex + 5 > photos.length) {
        nextPage();
      }

      if (e.key === "ArrowRight") {
        setPreviewPhoto(photos[previewPhotoIndex + 1]);
      }
      if (e.key === "ArrowLeft") {
        setPreviewPhoto(photos[previewPhotoIndex - 1]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewPhoto, photos, nextPage]);

  return (
    <div className={styles.app}>
      <ul className={styles.photoGrid}>
        {photos.map((photo, idx) => {
          const isFavorite = favorites.some((fav) => fav.id === photo.id);
          return (
            <Card
              key={photo.id}
              photo={photo}
              idx={idx}
              isFavorite={isFavorite}
              setFavorite={setFavorite}
              onPreviewClick={() => setPreviewPhoto(photo)}
            />
          );
        })}
      </ul>
      {favorites.at(0) && (
        <Favorites
          doClear={clearFavorites}
          doDownloadAll={handleDownloadAll}
          count={favorites.length}
          isDownloading={isDownloading}
        >
          {favorites.map((photo, idx) => {
            const isFavorites = favorites.some((fav) => fav.id === photo.id);
            return (
              <Card
                size="small"
                key={photo.id}
                photo={photo}
                idx={idx}
                isFavorite={isFavorites}
                setFavorite={setFavorite}
                onPreviewClick={() => setPreviewPhoto(photo)}
              />
            );
          })}
        </Favorites>
      )}
      {photos.length > 0 && <LoadingIndicator />}
      <div style={{ display: !fetching ? "block" : "none" }} ref={bottomRef} />
      <PreviewDialog
        photo={previewPhoto}
        onClose={() => setPreviewPhoto(null)}
      />
    </div>
  );
}

export default App;
