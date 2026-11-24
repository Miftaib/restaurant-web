import { type MenuItem } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

interface MenuItemRowProps {
  item: MenuItem;
  showPhotoColumn?: boolean;
}

/**
 * MenuItemRow — Design.md §6 P1, §7
 * Kartu baris menu dengan pemisah garis titik nota (.dotted-divider).
 * Teks kiri, foto 88x88 atau monogram tile kanan.
 * Item habis: chip "Habis", foto diredupkan, teks tetap kontras tinggi.
 */
export function MenuItemRow({ item, showPhotoColumn = true }: MenuItemRowProps) {
  const initial = item.name ? item.name.charAt(0).toUpperCase() : "?";
  const isHabis = !item.is_available;

  return (
    <article
      className={`
        flex items-start justify-between gap-3 sm:gap-4 py-4 dotted-divider
        transition-colors duration-150
      `}
      aria-label={`${item.name}, ${formatRupiah(item.price)}${isHabis ? ", habis" : ""}`}
    >
      {/* Kolom Teks Kiri */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Baris Nama & Chip Habis */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-body font-bold text-base sm:text-lg text-ink leading-snug">
            {item.name}
          </h3>

          {isHabis && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-habis-bg text-habis-ink border border-line-strong/20 shrink-0"
              role="status"
            >
              <SlashCircleIcon className="w-3 h-3 text-habis-ink" />
              <span>Habis</span>
            </span>
          )}
        </div>

        {/* Deskripsi Menu (maks 2 baris) */}
        {item.description && (
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        {/* Harga Tabular Rupiah */}
        <p className="font-body font-semibold text-sm sm:text-base text-ink price-tabular">
          {formatRupiah(item.price)}
        </p>
      </div>

      {/* Kolom Kanan: Foto Menu atau Monogram Tile */}
      {showPhotoColumn && (
        <div
          className={`
            w-20 h-20 sm:w-22 sm:h-22 rounded-md shrink-0 overflow-hidden border border-line bg-sunken
            flex items-center justify-center select-none
            ${isHabis ? "opacity-60 grayscale-[40%]" : ""}
          `}
          aria-hidden="true"
        >
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display font-semibold text-2xl text-ink-muted/50">
              {initial}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

function SlashCircleIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}
