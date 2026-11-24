import { type Restaurant } from "@/lib/types";

interface HeroProps {
  restaurant: Restaurant;
}

/**
 * Hero — Design.md §6 P1
 * Kompak, bukan layar penuh.
 * Memastikan kategori nav dan item pertama terlihat di layar HP 360x640 (Prinsip 1).
 */
export function Hero({ restaurant }: HeroProps) {
  const initial = restaurant.name ? restaurant.name.charAt(0).toUpperCase() : "R";

  return (
    <section className="pt-4 pb-8 sm:pt-6 sm:pb-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
      {/* Foto Utama atau Monogram Tile */}
      {restaurant.hero_image_url ? (
        <div className="w-full max-w-2xl mx-auto mb-6 aspect-video sm:aspect-[16/9] rounded-md overflow-hidden bg-sunken border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.hero_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-md bg-sunken border border-line flex items-center justify-center">
          <span className="font-display text-3xl sm:text-4xl text-brand font-semibold select-none">
            {initial}
          </span>
        </div>
      )}

      {/* Nama Restoran */}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-2">
        {restaurant.name}
      </h1>

      {/* Tagline */}
      {restaurant.tagline && (
        <p className="text-base sm:text-lg text-ink-muted max-w-md mx-auto mb-6">
          {restaurant.tagline}
        </p>
      )}

      {/* Aksi Berdampingan: Lihat Menu & Buka Maps */}
      <div className="flex items-center justify-center gap-3">
        <a
          href="#menu"
          className="inline-flex items-center justify-center h-11 px-5 rounded-md border-2 border-ink text-ink font-semibold text-sm hover:bg-ink/5 active:bg-ink/10 transition-colors"
        >
          Lihat Menu
        </a>

        {restaurant.maps_url && (
          <a
            href={restaurant.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-md border-2 border-line-strong text-ink font-semibold text-sm hover:border-ink hover:bg-ink/5 active:bg-ink/10 transition-colors"
          >
            <MapPinIcon className="w-4 h-4 text-brand" />
            <span>Buka Maps</span>
          </a>
        )}
      </div>
    </section>
  );
}

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
