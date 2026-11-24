"use client";

import { useId } from "react";

/**
 * Switch — Design.md §7
 * Dipakai untuk "Tersedia/Habis" dan "Tampil di situs"
 * role="switch", aria-checked, 48×28 px
 */

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Teks yang ditampilkan di bawah switch */
  statusText?: string;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  statusText,
  disabled = false,
  loading = false,
  name,
}: SwitchProps) {
  const id = useId();

  return (
    <div className="flex flex-col items-end gap-0.5">
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        aria-busy={loading}
        disabled={disabled || loading}
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-7 rounded-full
          transition-colors duration-150 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${checked ? "bg-success" : "bg-line-strong"}
        `}
        name={name}
      >
        <span
          className={`
            absolute top-0.5 left-0.5
            w-6 h-6 rounded-full bg-white
            shadow-sm
            transition-transform duration-150 ease-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
          aria-hidden="true"
        />
      </button>
      {statusText && (
        <span className="text-xs font-semibold text-ink-muted">
          {statusText}
        </span>
      )}
    </div>
  );
}
