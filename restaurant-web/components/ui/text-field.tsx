import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from "react";

/**
 * TextField — Design.md §7 Admin
 * Label selalu terlihat di atas field, tidak pernah hanya placeholder.
 * State: default, hover, focus, filled, error, disabled
 */

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, id: propId, className = "", ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label
          htmlFor={id}
          className="text-sm font-semibold text-ink"
        >
          {label}
          {props.required && (
            <span className="text-danger ml-1" aria-hidden="true">*</span>
          )}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={`
            h-11 px-3 rounded-md border bg-surface text-ink
            placeholder:text-ink-muted/50
            transition-colors duration-150
            ${
              error
                ? "border-danger focus:ring-danger/20"
                : "border-line-strong focus:border-ink focus:ring-ink/10"
            }
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-danger flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-sm text-ink-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

/**
 * TextArea — variant untuk teks panjang dengan hitungan karakter
 */
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  charCount?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, charCount, maxLength, id: propId, value, className = "", ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <div className="flex justify-between items-baseline">
          <label htmlFor={id} className="text-sm font-semibold text-ink">
            {label}
            {props.required && (
              <span className="text-danger ml-1" aria-hidden="true">*</span>
            )}
          </label>
          {charCount && maxLength && (
            <span className="text-xs text-ink-muted">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={`
            min-h-24 px-3 py-2.5 rounded-md border bg-surface text-ink resize-y
            placeholder:text-ink-muted/50
            transition-colors duration-150
            ${
              error
                ? "border-danger focus:ring-danger/20"
                : "border-line-strong focus:border-ink focus:ring-ink/10"
            }
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-danger flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-sm text-ink-muted">{hint}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextField, TextArea, type TextFieldProps, type TextAreaProps };
