import Link from "next/link";
import { type Restaurant } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface FooterProps {
  restaurant: Restaurant;
}

/**
 * Footer — Design.md §6 P1 (Footer Editorial)
 * Nama restoran, tanggal pembaruan terakhir (Prinsip 2), dan link admin.
 */
export function Footer({ restaurant }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const updateDate = restaurant.updated_at
    ? formatDate(restaurant.updated_at)
    : "24 Nov 2026";

  return (
    <footer className="py-12 border-t border-line text-center text-xs text-ink-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
        <p className="font-semibold text-ink text-sm">
          {restaurant.name}
        </p>

        <p>
          Menu terakhir diperbarui pada {updateDate}
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          {restaurant.instagram && (
            <a
              href={`https://instagram.com/${restaurant.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink underline underline-offset-2"
            >
              Instagram
            </a>
          )}

          <Link
            href="/admin/masuk"
            className="hover:text-ink underline underline-offset-2"
          >
            Kelola Menu (Admin)
          </Link>
        </div>

        <p className="text-ink-muted/50 pt-4">
          © {currentYear} {restaurant.name}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
