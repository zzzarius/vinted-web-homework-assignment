import { useEffect, useRef } from "react";

import type { Photo } from "../../../api/Pexels.types";
import styles from "./PreviewDialog.module.css";

interface PreviewDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  photo: Photo;
}

export function PreviewDialog({
  isOpen,
  setIsOpen,
  photo,
}: PreviewDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

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
