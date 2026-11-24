import { type Restaurant } from "@/lib/types";
import { whatsappUrl } from "@/lib/format";

interface WhatsAppBarProps {
  restaurant: Restaurant;
}

/**
 * WhatsAppBar — Design.md §6 P1, §7, §9
 * Bar melayang menempel di bawah (mobile & tablet).
 * 56 px, r-full, e2 shadow, warna --wa (#0B7A3E).
 * Di desktop (≥1024px) disembunyikan karena sudah ada tombol di TopBar.
 * Sembunyi jika whatsapp_number kosong (FR-3.4).
 */
export function WhatsAppBar({ restaurant }: WhatsAppBarProps) {
  if (!restaurant.whatsapp_number) return null;

  const url = whatsappUrl(
    restaurant.whatsapp_number,
    restaurant.whatsapp_default_message
  );

  return (
    <div
      className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none lg:hidden"
      aria-label="Pemesanan WhatsApp"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          pointer-events-auto
          w-full max-w-md h-14 px-6 rounded-full
          bg-wa text-wa-ink font-semibold text-sm sm:text-base
          flex items-center justify-center gap-3
          shadow-[var(--e2)]
          hover:bg-wa/90 active:scale-[0.98]
          transition-all duration-150
        `}
      >
        <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
        <span className="truncate">Tanya atau pesan via WhatsApp</span>
      </a>
    </div>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.031 2C6.516 2 2.031 6.484 2.031 12C2.031 13.918 2.57 15.707 3.504 17.227L2.148 22L7.043 20.699C8.508 21.527 10.219 22 12.031 22C17.547 22 22.031 17.516 22.031 12C22.031 6.484 17.547 2 12.031 2ZM17.438 16.516C17.215 17.145 16.328 17.68 15.633 17.777C15.156 17.844 14.535 17.891 12.438 17.02C9.758 15.906 8.031 13.18 7.898 13C7.766 12.82 6.828 11.574 6.828 10.281C6.828 8.988 7.484 8.359 7.746 8.086C7.969 7.852 8.332 7.75 8.633 7.75C8.734 7.75 8.828 7.754 8.91 7.758C9.156 7.77 9.277 7.785 9.441 8.176C9.645 8.664 10.141 9.879 10.203 10.008C10.266 10.137 10.328 10.312 10.238 10.484C10.148 10.656 10.082 10.742 9.949 10.898C9.816 11.055 9.691 11.176 9.559 11.332C9.414 11.492 9.262 11.664 9.426 11.945C9.59 12.227 10.152 13.148 10.988 13.891C12.066 14.852 12.945 15.16 13.254 15.289C13.562 15.418 13.738 15.391 13.918 15.184C14.102 14.977 14.707 14.27 14.922 13.965C15.137 13.66 15.344 13.707 15.633 13.816C15.922 13.926 17.473 14.691 17.781 14.848C18.09 15.004 18.293 15.082 18.367 15.207C18.441 15.332 18.441 15.945 18.219 16.574H17.438V16.516Z" />
    </svg>
  );
}
