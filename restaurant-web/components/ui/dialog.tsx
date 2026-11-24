"use client";

import { useRef, useEffect, type ReactNode } from "react";

/**
 * Dialog — Design.md §7
 * Konfirmasi hapus, buang perubahan, sesi berakhir.
 * role="dialog", aria-modal, fokus dikurung, Esc menutup.
 */

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Tombol-tombol aksi */
  actions?: ReactNode;
}

export function Dialog({ open, onClose, title, children, actions }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`
        w-[min(calc(100%-32px),480px)]
        p-0 rounded-lg bg-surface
        shadow-[var(--e3)]
        backdrop:bg-ink/40
      `}
      aria-labelledby="dialog-title"
    >
      <div className="p-6">
        <h2 id="dialog-title" className="text-lg font-bold text-ink mb-2">
          {title}
        </h2>
        <div className="text-sm text-ink-muted">{children}</div>
      </div>
      {actions && (
        <div className="flex justify-end gap-3 px-6 pb-6">{actions}</div>
      )}
    </dialog>
  );
}
