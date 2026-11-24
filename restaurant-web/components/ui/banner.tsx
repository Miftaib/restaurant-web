/**
 * Banner — Design.md §7
 * Info (offline), Peringatan. role="status".
 */

type BannerVariant = "info" | "warning";

interface BannerProps {
  variant?: BannerVariant;
  children: React.ReactNode;
  onDismiss?: () => void;
}

const variantStyles: Record<BannerVariant, string> = {
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
};

export function Banner({
  variant = "info",
  children,
  onDismiss,
}: BannerProps) {
  return (
    <div
      role="status"
      className={`
        px-4 py-3 text-sm font-medium
        border rounded-md
        flex items-center gap-3
        ${variantStyles[variant]}
      `}
    >
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="opacity-70 hover:opacity-100 cursor-pointer"
          aria-label="Tutup"
        >
          ✕
        </button>
      )}
    </div>
  );
}
