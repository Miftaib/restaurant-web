export const dynamic = "force-dynamic";

export default function AdminKategoriPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">
          Kelola Kategori Menu
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Atur nama dan urutan kategori menu yang ditampilkan di situs publik.
        </p>
      </div>

      <div className="p-8 rounded-lg bg-surface border border-line text-center max-w-md mx-auto space-y-3">
        <span className="text-3xl">📁</span>
        <h2 className="font-display text-lg font-bold text-ink">
          Modul Kategori Menu
        </h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          Fitur CRUD Kategori lengkap, pengaturan urutan (sort order), dan proteksi penghapusan kategori akan dibangun di Fase 3.
        </p>
      </div>
    </div>
  );
}
