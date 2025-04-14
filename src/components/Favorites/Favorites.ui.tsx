import { useState } from "react";
import styles from "./Favorites.module.css";

type FavoritesProps = {
  children: React.ReactNode;
  doClear?: () => void;
  doDownloadAll?: () => void;
  count?: number;
  isDownloading?: boolean;
};

export function Favorites({
  children,
  doClear,
  doDownloadAll,
  count = 0,
  isDownloading = false,
}: FavoritesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={styles.favoritesWrapper}>
      <div className={styles.controls}>
        <h2 className={styles.title}>
          You have {count} favorite{count === 1 ? "" : "s"}
        </h2>
        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand"
            className={styles.expandButton}
          >
            ⬆️⬆️⬆️
          </button>
        )}
        {isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Collapse"
            className={styles.collapseButton}
          >
            ⬇️⬇️⬇️
          </button>
        )}
        <div className={styles.buttons}>
          {doDownloadAll && (
            <button
              type="button"
              className={styles.downloadAll}
              onClick={doDownloadAll}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download all favorites"}
            </button>
          )}
          {doClear && (
            <button type="button" className={styles.clear} onClick={doClear}>
              Clear all
            </button>
          )}
        </div>
      </div>
      {isExpanded && <ul className={styles.favoritesStrip}>{children}</ul>}
    </div>
  );
}
