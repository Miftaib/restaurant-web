import { whatsappUrl } from "@/lib/format";
import { type Restaurant } from "@/lib/types";

interface EmptyMenuProps {
  restaurant: Restaurant;
}

/**
 * EmptyMenu — PRD E2, Design.md §8 (P1 Menu Kosong)
 * Ditampilkan jika belum ada kategori atau menu aktif.
 */
export function EmptyMenu({ restaurant }: EmptyMenuProps) {
  const waLink = restaurant.whatsapp_number
    ? whatsappUrl(restaurant.whatsapp_number, restaurant.whatsapp_default_message)
    : null;

  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-sunken flex items-center justify-center text-ink-muted">
        <UtensilsCrossedIcon className="w-8 h-8" />
      </div>

      <h3 className="font-display text-xl font-semibold text-ink">
        Menu Segera Hadir
      </h3>

      <p className="font-body text-sm text-ink-muted leading-relaxed">
        Daftar menu sedang dipersiapkan oleh pemilik kedai. Sementara itu, Anda dapat langsung menanyakan ketersediaan menu melalui WhatsApp.
      </p>

      {waLink && (
        <div className="pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-wa text-wa-ink text-sm font-semibold hover:bg-wa/90 transition-colors shadow-sm"
          >
            Tanya via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function UtensilsCrossedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z" />
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
      <path d="m2.1 21.8 6.4-6.3" />
      <path d="m19 5-7 7" />
    </svg>
  );
}
