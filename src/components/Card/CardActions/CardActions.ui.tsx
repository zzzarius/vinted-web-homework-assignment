import styles from "./CardActions.module.css";

interface CardActionsProps {
  photoId: number;
  isFavorites: boolean;
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
  handlePreviewOpen: () => void;
}

export function CardActions({
  photoId,
  isFavorites,
  setFavorites,
  handlePreviewOpen,
}: CardActionsProps) {
  function handleFavoritesClick(id: number) {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((num) => num !== id);
      }
      return [...prev, id];
    });
  }

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.btnFavorite}
        onClick={() => handleFavoritesClick(photoId)}
      >
        {isFavorites ? "Unfavorite" : "Favourite"}
      </button>
      <button
        type="button"
        className={styles.btnPreview}
        onClick={handlePreviewOpen}
        aria-label="Open preview"
      >
        🔍
      </button>
    </div>
  );
}
