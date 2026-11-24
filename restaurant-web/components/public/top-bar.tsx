"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Restaurant } from "@/lib/types";
import { whatsappUrl } from "@/lib/format";

interface TopBarProps {
  restaurant: Restaurant;
}

/**
 * TopBar — Design.md §6 P1, §7
 * 56 px, sticky top.
 * Transparan di atas hero, solid surface + shadow e1 saat di-scroll.
 * Nama restoran muncul setelah hero tergulir lewat.
 */
export function TopBar({ restaurant }: TopBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hero tingginya sekitar 200px-260px, setelah lewat itu topbar solid & tampilkan nama
      setIsScrolled(window.scrollY > 140);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initial = restaurant.name ? restaurant.name.charAt(0).toUpperCase() : "R";
  const waLink = restaurant.whatsapp_number
    ? whatsappUrl(restaurant.whatsapp_number, restaurant.whatsapp_default_message)
    : null;

  return (
    <header
      className={`
        sticky top-0 z-40 w-full h-14
        transition-all duration-200
        ${
          isScrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-line shadow-[var(--e1)]"
            : "bg-paper/80 backdrop-blur-sm border-b border-transparent"
        }
      `}
    >
      <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Kiri: Logo / Monogram + Nama */}
        <Link
          href="#main-content"
          className="flex items-center gap-2.5 group focus-visible:rounded-md"
        >
          <div className="w-8 h-8 rounded-md bg-sunken flex items-center justify-center border border-line shrink-0">
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logo_url}
                alt={`Logo ${restaurant.name}`}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="font-display font-semibold text-brand text-base leading-none">
                {initial}
              </span>
            )}
          </div>
          <span
            className={`
              font-display font-semibold text-ink text-base tracking-tight transition-opacity duration-200
              ${isScrolled ? "opacity-100" : "opacity-0 sm:opacity-100"}
            `}
          >
            {restaurant.name}
          </span>
        </Link>

        {/* Kanan: Navigasi Cepat & WhatsApp Desktop */}
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-semibold" aria-label="Navigasi cepat">
          <Link
            href="#menu"
            className="text-ink-muted hover:text-ink transition-colors underline-offset-4 hover:underline"
          >
            Menu
          </Link>
          <Link
            href="#lokasi"
            className="text-ink-muted hover:text-ink transition-colors underline-offset-4 hover:underline"
          >
            Lokasi
          </Link>

          {/* Tombol WhatsApp di TopBar khusus Desktop (≥ 1024px) */}
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-wa text-wa-ink text-xs font-semibold hover:bg-wa/90 active:bg-wa/80 transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Pesan via WhatsApp</span>
            </a>
          )}

          {/* Link Admin diskret */}
          <Link
            href="/admin/masuk"
            className="text-xs text-ink-muted/60 hover:text-ink transition-colors px-2 py-1 rounded hover:bg-sunken"
            title="Portal Kelola Menu (Admin)"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.031 2C6.516 2 2.031 6.484 2.031 12C2.031 13.918 2.57 15.707 3.504 17.227L2.148 22L7.043 20.699C8.508 21.527 10.219 22 12.031 22C17.547 22 22.031 17.516 22.031 12C22.031 6.484 17.547 2 12.031 2ZM17.438 16.516C17.215 17.145 16.328 17.68 15.633 17.777C15.156 17.844 14.535 17.891 12.438 17.02C9.758 15.906 8.031 13.18 7.898 13C7.766 12.82 6.828 11.574 6.828 10.281C6.828 8.988 7.484 8.359 7.746 8.086C7.969 7.852 8.332 7.75 8.633 7.75C8.734 7.75 8.828 7.754 8.91 7.758C9.156 7.77 9.277 7.785 9.441 8.176C9.645 8.664 10.141 9.879 10.203 10.008C10.266 10.137 10.328 10.312 10.238 10.484C10.148 10.656 10.082 10.742 9.949 10.898C9.816 11.055 9.691 11.176 9.559 11.332C9.414 11.492 9.262 11.664 9.426 11.945C9.59 12.227 10.152 13.148 10.988 13.891C12.066 14.852 12.945 15.16 13.254 15.289C13.562 15.418 13.738 15.391 13.918 15.184C14.102 14.977 14.707 14.27 14.922 13.965C15.137 13.66 15.344 13.707 15.633 13.816C15.922 13.926 17.473 14.691 17.781 14.848C18.09 15.004 18.293 15.082 18.367 15.207C18.441 15.332 18.441 15.945 18.219 16.574H17.438V16.516Z" />
    </svg>
  );
}
