import { useEffect, useRef } from "react";

import type { Photo } from "../../api/Pexels.types";
import styles from "./PreviewDialog.module.css";

interface PreviewDialogProps {
  show: boolean;
  photo: Photo | null;
  onClose?: () => void;
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

  useEffect(() => {
    function closeDialog(e: Event): void {
      e.preventDefault();
      onClose?.();
    }
    ref.current?.addEventListener("close", closeDialog);

    return () => {
      ref.current?.removeEventListener("close", closeDialog);
    };
  }, [onClose]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (e.target === ref.current) {
        onClose?.();
      }
    }
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, show]);

  return (
    <dialog className={styles.previewDialog} ref={ref} tabIndex={-1}>
      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Close"
          className={styles.closeButton}
          onClick={onClose}
        />
      </div>
      {photo && (
        <img className={styles.image} src={photo.src.large2x} alt={photo.alt} />
      )}
    </dialog>
  );
}
