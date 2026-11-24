"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * Toast — Design.md §7
 * Sukses: 8 detik dengan "Urungkan". Error: tidak hilang otomatis.
 */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss untuk sukses & info (8 detik), error tidak hilang
    if (toast.type !== "error") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 8000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 items-center pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            w-full max-w-md px-4 py-3 rounded-md shadow-lg
            flex items-center gap-3 text-sm font-medium
            animate-in slide-in-from-bottom-4
            ${
              toast.type === "success"
                ? "bg-success text-white"
                : toast.type === "error"
                ? "bg-danger text-white"
                : "bg-info text-white"
            }
          `}
          role={toast.type === "error" ? "alert" : "status"}
          onMouseEnter={(e) => {
            // Pause auto-dismiss saat hover — Design.md §7
            e.currentTarget.dataset.paused = "true";
          }}
        >
          <span className="flex-1">{toast.message}</span>
          {toast.action && (
            <button
              onClick={() => {
                toast.action!.onClick();
                onDismiss(toast.id);
              }}
              className="underline font-bold whitespace-nowrap cursor-pointer"
            >
              {toast.action.label}
            </button>
          )}
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-1 opacity-70 hover:opacity-100 cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
