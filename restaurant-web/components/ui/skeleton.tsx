/**
 * Skeleton — Design.md §7
 * Placeholder loading. Warna --sunken, tanpa animasi kilau di prefers-reduced-motion.
 */

interface SkeletonProps {
  className?: string;
  /** Lebar: misal "w-32", "w-full" */
  width?: string;
  /** Tinggi: misal "h-4", "h-11" */
  height?: string;
}

export function Skeleton({
  className = "",
  width = "w-full",
  height = "h-4",
}: SkeletonProps) {
  return (
    <div
      className={`
        ${width} ${height}
        bg-sunken rounded-md
        animate-pulse motion-reduce:animate-none
        ${className}
      `}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonText — beberapa baris skeleton untuk teks
 */
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="h-4"
          width={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonMenuRow — skeleton satu baris menu (Design.md P1 §4)
 */
export function SkeletonMenuRow() {
  return (
    <div className="flex items-start gap-3 py-4 dotted-divider" aria-hidden="true">
      <div className="flex-1 space-y-2">
        <Skeleton height="h-5" width="w-3/4" />
        <Skeleton height="h-3" width="w-full" />
        <Skeleton height="h-4" width="w-20" />
      </div>
      <Skeleton width="w-22" height="h-22" className="rounded-md shrink-0" />
    </div>
  );
}
