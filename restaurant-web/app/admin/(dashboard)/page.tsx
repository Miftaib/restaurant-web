import Link from "next/link";
import { getMenuCategoriesWithItems } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * A3: Halaman Utama Admin — Portal Menu
 * Di Fase 2, halaman ini menyediakan fondasi portal admin terproteksi,
 * ringkasan konten, dan navigasi cepat menuju fitur Fase 3 & 4.
 */
export default async function AdminHomePage() {
  const categories = await getMenuCategoriesWithItems();

  const totalCategories = categories.length;
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalAvailable = categories.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.is_available).length,
    0
  );
  const totalSoldOut = totalItems - totalAvailable;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Kelola Menu & Restoran
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Selamat datang di portal admin mandiri kedai Anda.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-md border border-line-strong text-ink text-xs font-semibold hover:bg-sunken transition-colors self-start sm:self-auto"
        >
          <span>Buka Tampilan Publik</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Kartu Ringkasan Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface p-4 rounded-lg border border-line">
          <span className="text-xs font-semibold text-ink-muted">Total Kategori</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">
            {totalCategories}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-line">
          <span className="text-xs font-semibold text-ink-muted">Total Menu</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">
            {totalItems}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-line">
          <span className="text-xs font-semibold text-success">Menu Tersedia</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-success mt-1">
            {totalAvailable}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-line">
          <span className="text-xs font-semibold text-brand">Menu Habis</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-brand mt-1">
            {totalSoldOut}
          </p>
        </div>
      </div>

      {/* Navigasi Modul Admin */}
      <div className="space-y-4 pt-2">
        <h2 className="font-display text-lg font-bold text-ink">
          Modul Pengelolaan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card Menu */}
          <div className="bg-surface p-5 rounded-lg border border-line hover:border-ink transition-colors flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-md bg-sunken flex items-center justify-center text-brand mb-3">
                <MenuBookIcon className="w-5 h-5" />
              </div>
              <h3 className="font-body font-bold text-base text-ink">
                Daftar & Stok Menu
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Ubah ketersediaan stok habis/tersedia dengan satu ketukan, ubah harga, dan tambah menu baru.
              </p>
            </div>
            <span className="text-xs font-semibold text-brand inline-flex items-center gap-1">
              Fase 3 · Siap Dikerjakan →
            </span>
          </div>

          {/* Card Kategori */}
          <Link
            href="/admin/kategori"
            className="bg-surface p-5 rounded-lg border border-line hover:border-ink transition-colors flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-sunken flex items-center justify-center text-ink mb-3 group-hover:text-brand transition-colors">
                <CategoryIcon className="w-5 h-5" />
              </div>
              <h3 className="font-body font-bold text-base text-ink">
                Kelola Kategori
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Atur nama kelompok makanan/minuman dan urutan tampilan di halaman utama.
              </p>
            </div>
            <span className="text-xs font-semibold text-ink group-hover:text-brand inline-flex items-center gap-1">
              Buka Kategori →
            </span>
          </Link>

          {/* Card Profil */}
          <Link
            href="/admin/profil"
            className="bg-surface p-5 rounded-lg border border-line hover:border-ink transition-colors flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-sunken flex items-center justify-center text-ink mb-3 group-hover:text-brand transition-colors">
                <StoreIcon className="w-5 h-5" />
              </div>
              <h3 className="font-body font-bold text-base text-ink">
                Profil Restoran
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Ubah nama, alamat, nomor WhatsApp, tautan Google Maps, dan deskripsi kedai.
              </p>
            </div>
            <span className="text-xs font-semibold text-ink group-hover:text-brand inline-flex items-center gap-1">
              Buka Profil →
            </span>
          </Link>
        </div>
      </div>
    </div>
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
