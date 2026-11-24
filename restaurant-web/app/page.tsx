import Link from "next/link";

/**
 * Halaman publik utama — placeholder Fase 0.
 * Akan dibangun lengkap di Fase 1.
 */
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Skip link untuk aksesibilitas */}
      <a href="#main-content" className="skip-link">
        Lewati ke menu
      </a>

      <div id="main-content" className="max-w-md space-y-6">
        {/* Monogram */}
        <div className="w-20 h-20 mx-auto rounded-md bg-sunken flex items-center justify-center">
          <span className="font-display text-4xl text-brand font-semibold">
            K
          </span>
        </div>

        {/* Nama */}
        <h1 className="font-display text-4xl font-semibold text-ink">
          Kedai Nusantara
        </h1>

        <p className="text-ink-muted">
          Cita rasa rumahan, harga bersahabat
        </p>

        {/* Status */}
        <div className="p-4 rounded-md bg-sunken text-ink-muted text-sm">
          <p className="font-semibold text-ink mb-1">🚧 Dalam Pembangunan</p>
          <p>
            Website sedang dibangun. Design tokens, font, dan komponen dasar
            sudah siap. Halaman publik lengkap akan hadir di Fase 1.
          </p>
        </div>

        {/* Link ke admin */}
        <Link
          href="/admin/masuk"
          className="inline-flex items-center gap-2 text-brand underline underline-offset-2 text-sm font-semibold hover:text-brand/80"
        >
          Masuk ke Admin →
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-xs text-ink-muted">
        Fase 0 · Fondasi Proyek
      </footer>
    </main>
  );
}
