import { useEffect, useRef, useState } from "react";

import type { Photo } from "../../api/Pexels.types";
import styles from "./PreviewDialog.module.css";

interface PreviewDialogProps {
  show: boolean;
  photo: Photo | null;
  onClose: () => void;
}

export function PreviewDialog({ photo, onClose, show }: PreviewDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (show) {
      ref.current?.showModal();
    } else {
      ref.current?.close?.();
    }
  }, [show]);

  function handleClose() {
    ref.current?.close?.();
    onClose();
  }

  return (
    <dialog className={styles.previewDialog} ref={ref} tabIndex={-1}>
      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Close"
          className={styles.closeButton}
          onClick={handleClose}
        />
      </div>
      {photo && (
        <img className={styles.image} src={photo.src.large2x} alt={photo.alt} />
      )}
    </dialog>
  );
}
