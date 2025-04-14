import { useState } from "react";
import type { Photo } from "../../api/Pexels.types";
import { ITEMS_PER_PAGE } from "../../constants";
import { clsx } from "../../utils";
import styles from "./Card.module.css";
import { CardActions } from "./CardActions";
import { CardDescription } from "./CardDescription";
import { PreviewDialog } from "./PreviewDialog";

interface CardProps {
  photo: Photo;
  idx: number;
  isFavorites: boolean;
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
}

export function Card({ photo, idx, isFavorites, setFavorites }: CardProps) {
  const [previewIsOpen, setPreviewIsOpen] = useState<boolean>(false);

  function handlePreviewOpen() {
    setPreviewIsOpen(true);
  }
  return (
    <li
      key={photo.src.original}
      className={clsx(styles.card, isFavorites && styles.favorite)}
      style={
        {
          animationDelay: `${(idx % ITEMS_PER_PAGE) * 80}ms`,
          ["--color-card-bg" as string]: photo.avg_color,
        } as React.CSSProperties
      }
    >
      <figure className={styles.figure}>
        <img
          src={photo.src.large}
          alt={photo.alt}
          fetchPriority="high"
          srcSet={`${photo.src.large2x} 2x`}
        />
        <figcaption className={styles.figcaption}>
          <CardDescription alt={photo.alt} photographer={photo.photographer} />
          <CardActions
            setFavorites={setFavorites}
            photoId={photo.id}
            isFavorites={isFavorites}
            handlePreviewOpen={handlePreviewOpen}
          />
        </figcaption>
      </figure>
      <PreviewDialog
        isOpen={previewIsOpen}
        setIsOpen={setPreviewIsOpen}
        photo={photo}
      />
    </li>
  );
}
