import { type ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Button — Design.md §7
 * Varian: primer (--ink), sekunder (garis), ghost (teks), wa (--wa), danger
 * Ukuran: md (44px), lg (52px)
 */

type ButtonVariant = "primer" | "sekunder" | "ghost" | "wa" | "danger";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primer:
    "bg-ink text-paper hover:bg-ink/90 active:bg-ink/80",
  sekunder:
    "border-2 border-ink text-ink hover:bg-ink/5 active:bg-ink/10",
  ghost:
    "text-ink hover:bg-ink/5 active:bg-ink/10 underline-offset-2",
  wa:
    "bg-wa text-wa-ink hover:bg-wa/90 active:bg-wa/80",
  danger:
    "bg-danger text-white hover:bg-danger/90 active:bg-danger/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",    // 44px
  lg: "h-13 px-6 text-base",  // 52px
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primer",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          font-semibold rounded-md
          transition-colors duration-150 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant };
