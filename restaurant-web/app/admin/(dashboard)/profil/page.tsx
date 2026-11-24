export const dynamic = "force-dynamic";

export default function AdminProfilPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">
          Profil Restoran
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Ubah informasi kontak, tautan Google Maps, dan pesan WhatsApp restoran.
        </p>
      </div>

      <div className="p-8 rounded-lg bg-surface border border-line text-center max-w-md mx-auto space-y-3">
        <span className="text-3xl">🏪</span>
        <h2 className="font-display text-lg font-bold text-ink">
          Modul Profil Restoran
        </h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          Form pengubahan profil restoran, nomor WhatsApp, alamat Google Maps, dan upload foto akan dibangun di Fase 4.
        </p>
      </div>
    </div>
  );
}
