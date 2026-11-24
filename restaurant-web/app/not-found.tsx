import Link from "next/link";

/**
 * 404 — Design.md P3
 * "Halaman tidak ditemukan", tombol "Ke beranda"
 */
export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="text-ink-muted">
          Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-ink text-paper font-semibold text-sm hover:bg-ink/90 transition-colors"
        >
          Ke beranda
        </Link>
      </div>
    </main>
  );
}
