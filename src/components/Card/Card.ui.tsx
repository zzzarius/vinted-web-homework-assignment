import type { MouseEventHandler } from "react";
import type { Photo } from "../../api/Pexels.types";
import { ITEMS_PER_PAGE } from "../../constants";
import { clsx } from "../../utils";
import styles from "./Card.module.css";
import { CardDescription } from "./CardDescription";

export interface CardProps {
  photo: Photo;
  idx: number;
  isFavorite: boolean;
  setFavorite: (photo: Photo) => void;
  size?: "large" | "small";
  onPreviewClick: MouseEventHandler<HTMLButtonElement>;
}

export function Card({
  photo,
  idx,
  isFavorite,
  setFavorite,
  size = "large",
  onPreviewClick,
}: CardProps) {
  return (
    <li
      key={photo.src.original}
      className={clsx(styles.card, styles[size])}
      style={
        {
          animationDelay: `${(idx % ITEMS_PER_PAGE) * 80}ms`,
          ["--color-card-bg" as string]: photo.avg_color,
        } as React.CSSProperties
      }
    >
      <button className={styles.button} type="button" onClick={onPreviewClick}>
        <figure className={styles.figure}>
          <img
            src={photo.src.large}
            alt={photo.alt}
            fetchPriority="high"
            srcSet={`${photo.src.large2x} 2x`}
          />
          {size === "large" && (
            <figcaption className={styles.figcaption}>
              <CardDescription
                alt={photo.alt}
                photographer={photo.photographer}
              />
            </figcaption>
          )}
        </figure>
      </button>
      {size === "large" && (
        <button
          type="button"
          onClick={() => setFavorite(photo)}
          className={styles.favoriteButton}
          aria-label="Add to favorites"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}
      {size === "small" && (
        <button
          type="button"
          onClick={() => setFavorite(photo)}
          className={styles.removeFavoriteButton}
          aria-label="Remove from favorites"
        >
          ❌
        </button>
      )}
    </li>
  );
}
