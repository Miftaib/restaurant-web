import { type Restaurant } from "@/lib/types";

interface LocationSectionProps {
  restaurant: Restaurant;
}

/**
 * LocationSection — Design.md §6 P1 (Lokasi dan Kontak)
 * Kartu --surface dengan batas tipis. Alamat teks terbaca penuh,
 * tombol "Buka di Google Maps", telepon, dan Instagram.
 */
export function LocationSection({ restaurant }: LocationSectionProps) {
  return (
    <section id="lokasi" className="py-10 sm:py-14 border-t border-line" aria-labelledby="lokasi-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2
          id="lokasi-title"
          className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-6"
        >
          Lokasi & Kontak
        </h2>

        <div className="bg-surface rounded-md border border-line p-5 sm:p-7 space-y-6">
          {/* Alamat */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
              Alamat
            </h3>
            <p className="font-body text-base text-ink leading-relaxed">
              {restaurant.address}
            </p>
          </div>

          {/* Tombol Buka di Google Maps */}
          {restaurant.maps_url && (
            <div>
              <a
                href={restaurant.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-11 px-6 rounded-md border-2 border-ink text-ink font-semibold text-sm hover:bg-ink/5 active:bg-ink/10 transition-colors"
              >
                <MapPinIcon className="w-4 h-4 text-brand" />
                <span>Buka di Google Maps</span>
                <ExternalLinkIcon className="w-3.5 h-3.5 text-ink-muted ml-0.5" />
              </a>
            </div>
          )}

          {/* Kontak & Sosial Media */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line/60">
            {/* Nomor Telepon */}
            {restaurant.contact_phone && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                  Telepon
                </h4>
                <a
                  href={`tel:${restaurant.contact_phone}`}
                  className="font-body text-base text-ink font-semibold hover:text-brand transition-colors inline-flex items-center gap-2"
                >
                  <PhoneIcon className="w-4 h-4 text-ink-muted" />
                  <span>{restaurant.contact_phone}</span>
                </a>
              </div>
            )}

            {/* Instagram */}
            {restaurant.instagram && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                  Instagram
                </h4>
                <a
                  href={`https://instagram.com/${restaurant.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-base text-ink font-semibold hover:text-brand transition-colors inline-flex items-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4 text-ink-muted" />
                  <span>@{restaurant.instagram.replace(/^@/, "")}</span>
                </a>
              </div>
            )}
          </div>
        </div>
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

function ExternalLinkIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
