"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { ToastProvider } from "@/components/ui/toast";
import { type Restaurant } from "@/lib/types";

interface AdminShellProps {
  children: React.ReactNode;
  restaurant: Restaurant;
  userEmail?: string | null;
}

const navItems = [
  {
    label: "Menu",
    href: "/admin",
    match: (pathname: string) => pathname === "/admin" || pathname.startsWith("/admin/menu"),
    icon: MenuBookIcon,
  },
  {
    label: "Kategori",
    href: "/admin/kategori",
    match: (pathname: string) => pathname.startsWith("/admin/kategori"),
    icon: CategoryIcon,
  },
  {
    label: "Profil",
    href: "/admin/profil",
    match: (pathname: string) => pathname.startsWith("/admin/profil"),
    icon: StoreIcon,
  },
];

/**
 * AdminShell — Design.md §4, §6 A3, §7 AdminShell, §9
 * Navigasi: Tab bawah 56 px di mobile (<768px), Sidebar 220 px di desktop.
 * Tiga tujuan saja: Menu · Kategori · Profil.
 * Header: tautan "Lihat situs" (tab baru) dan "Keluar".
 */
export function AdminShell({ children, restaurant, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const initial = restaurant.name ? restaurant.name.charAt(0).toUpperCase() : "R";

  return (
    <ToastProvider>
      <div className="min-h-screen bg-paper flex flex-col md:flex-row text-ink">
        {/* ========================================================
            SIDEBAR (Desktop & Tablet: ≥ 768px)
            ======================================================== */}
        <aside className="hidden md:flex flex-col w-56 lg:w-60 bg-surface border-r border-line shrink-0 sticky top-0 h-screen">
          {/* Header Sidebar: Identitas Restoran */}
          <div className="p-5 border-b border-line flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-sunken border border-line flex items-center justify-center shrink-0">
              <span className="font-display font-semibold text-brand text-lg">
                {initial}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-semibold text-sm text-ink truncate">
                {restaurant.name}
              </h2>
              <span className="inline-block text-[11px] font-semibold text-ink-muted">
                Portal Admin
              </span>
            </div>
          </div>

          {/* Navigasi Utama Sidebar (3 Menu) */}
          <nav className="flex-1 p-3 space-y-1" aria-label="Navigasi admin">
            {navItems.map((item) => {
              const active = item.match(pathname);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors
                    ${
                      active
                        ? "bg-brand-tint text-brand shadow-xs"
                        : "text-ink-muted hover:text-ink hover:bg-sunken"
                    }
                  `}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Sidebar: User info, Lihat Situs & Tombol Keluar */}
          <div className="p-4 border-t border-line space-y-3">
            {userEmail && (
              <p className="text-[11px] text-ink-muted truncate" title={userEmail}>
                {userEmail}
              </p>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs font-semibold text-ink-muted hover:text-ink transition-colors p-1"
            >
              <span>Lihat situs</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-between text-xs font-semibold text-danger hover:bg-danger/10 px-2 py-2 rounded-md transition-colors cursor-pointer"
              >
                <span>Keluar</span>
                <LogOutIcon className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </aside>

        {/* ========================================================
            HEADER MOBILE (< 768px)
            ======================================================== */}
        <header className="md:hidden sticky top-0 z-30 h-14 bg-surface/95 backdrop-blur-md border-b border-line px-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-sunken border border-line flex items-center justify-center shrink-0">
              <span className="font-display font-semibold text-brand text-xs">
                {initial}
              </span>
            </div>
            <span className="font-display font-semibold text-sm text-ink truncate">
              {restaurant.name}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-ink-muted hover:text-ink px-2 py-1 rounded bg-sunken inline-flex items-center gap-1"
            >
              <span>Situs</span>
              <ExternalLinkIcon className="w-3 h-3" />
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-semibold text-danger hover:bg-danger/10 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        </header>

        {/* ========================================================
            AREA KONTEN UTAMA
            ======================================================== */}
        <main className="flex-1 min-w-0 pb-20 md:pb-10">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* ========================================================
            BOTTOM TAB BAR (Mobile: < 768px)
            ======================================================== */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-surface border-t border-line grid grid-cols-3 shadow-[var(--e2)]"
          aria-label="Navigasi tab admin"
        >
          {navItems.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors
                  ${
                    active
                      ? "text-brand"
                      : "text-ink-muted hover:text-ink"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}

function MenuBookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
    </svg>
  );
}

function CategoryIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function StoreIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function LogOutIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
