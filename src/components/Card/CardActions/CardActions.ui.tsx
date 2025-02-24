import styles from "./CardActions.module.css";

interface CardActionsProps {
    photoId: number;
    isFavourite: boolean;
    setFavourites: React.Dispatch<React.SetStateAction<number[]>>;
    handlePreviewOpen: () => void;
}

export function CardActions({ photoId, isFavourite, setFavourites, handlePreviewOpen }: CardActionsProps) {
    function handleFavouriteClick(id: number) {
        setFavourites(prev => {
            if (prev.includes(id)) {
                return prev.filter((num) => num !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    return (
        <div className={styles.actions}>
            <button
                className={styles.btnFavorite}
                onClick={() => handleFavouriteClick(photoId)}
            >
                {isFavourite ? "Unfavourite" : "Favourite"}
            </button>
            <button
                className={styles.btnPreview}
                onClick={handlePreviewOpen}
                aria-label="Open preview"
            >
                🔍
            </button>
        </div>
    )
}