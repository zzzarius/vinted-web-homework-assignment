import { useEffect, useRef, useState } from "react";

import type { Photo } from "../../api/Pexels.types";
import styles from "./PreviewDialog.module.css";

interface PreviewDialogProps {
  photo: Photo | null;
  onClose: () => void;
}

export function PreviewDialog({ photo, onClose }: PreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setIsOpen(!!photo);
  }, [photo]);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close?.();
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    ref.current?.close?.();
    onClose();
  }

  if (!photo) {
    return null;
  }

  return (
    <dialog className={styles.previewDialog} ref={ref}>
      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Close"
          className={styles.closeButton}
          onClick={handleClose}
        />
      </div>
      <img className={styles.image} src={photo.src.large2x} alt={photo.alt} />
    </dialog>
  );
}
