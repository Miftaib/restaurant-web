"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type MenuItem, type MenuCategory } from "@/lib/types";
import { saveMenuItemAction, deleteMenuItemAction, uploadMenuPhotoAction } from "@/actions/menu";
import { compressImageClient } from "@/lib/image";
import { useToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface MenuFormProps {
  categories: MenuCategory[];
  initialData?: MenuItem | null;
}

/**
 * A4: Form Menu — Design.md §6 A4, §7
 * Urutan bidang: Nama (wajib) -> Kategori (wajib) -> Harga (wajib) -> Foto -> Deskripsi (maks 160) -> Stok -> Tampil.
 * Foto otomatis dikompres di browser sebelum diunggah (maks 1600px).
 */
export function MenuForm({ categories, initialData }: MenuFormProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const isEdit = Boolean(initialData);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || categories[0]?.id || ""
  );
  const [price, setPrice] = useState(initialData ? initialData.price.toString() : "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [isAvailable, setIsAvailable] = useState<boolean>(
    initialData ? initialData.is_available : true
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialData ? initialData.is_active : true
  );

  // Upload & submitting states
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler Upload Foto dengan Kompresi Otomatis di Browser
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      // 1. Kompresi di sisi klien (maks 1600px, WebP)
      const compressed = await compressImageClient(file);

      // 2. Upload via Server Action
      const formData = new FormData();
      formData.append("file", compressed);

      const res = await uploadMenuPhotoAction(formData);
      if (res.success && res.url) {
        setImageUrl(res.url);
        addToast({ type: "success", message: "Foto berhasil diunggah." });
      } else {
        addToast({
          type: "error",
          message: res.error || "Gagal mengunggah foto. Anda tetap bisa menyimpan menu tanpa foto.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses gambar.";
      addToast({ type: "error", message: msg });
    } finally {
      setIsUploading(false);
    }
  };

  // Handler Simpan Menu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama menu wajib diisi.");
      return;
    }

    if (!categoryId) {
      setErrorMsg("Pilih kategori menu.");
      return;
    }

    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMsg("Harga harus berupa angka bulat positif.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (initialData?.id) formData.append("id", initialData.id);
      formData.append("name", name.trim());
      formData.append("category_id", categoryId);
      formData.append("price", numPrice.toString());
      formData.append("description", description.trim());
      if (imageUrl) formData.append("image_url", imageUrl);
      formData.append("is_available", isAvailable ? "true" : "false");
      formData.append("is_active", isActive ? "true" : "false");

      const res = await saveMenuItemAction(formData);
      if (res.success) {
        addToast({
          type: "success",
          message: isEdit
            ? `Menu ${name} berhasil diperbarui.`
            : `Menu ${name} berhasil ditambahkan.`,
        });
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Gagal menyimpan menu.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Menu
  const handleDelete = async () => {
    if (!initialData?.id) return;
    setIsDeleting(true);

    try {
      const res = await deleteMenuItemAction(initialData.id);
      if (res.success) {
        addToast({
          type: "success",
          message: `Menu ${name} berhasil dihapus.`,
        });
        router.push("/admin");
        router.refresh();
      } else {
        addToast({ type: "error", message: res.error || "Gagal menghapus menu." });
      }
    } catch {
      addToast({ type: "error", message: "Gagal menghapus menu." });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Form */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-semibold text-ink-muted hover:text-ink inline-flex items-center gap-1 mb-1 transition-colors"
          >
            <span>← Kembali ke Daftar Menu</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink">
            {isEdit ? "Ubah Menu" : "Tambah Menu Baru"}
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-md bg-danger/10 border border-danger/20 text-danger text-xs font-semibold leading-relaxed"
        >
          {errorMsg}
        </div>
      )}

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-lg border border-line p-5 sm:p-6 space-y-5">
          {/* 1. Nama Menu (Wajib) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="menu-name" className="text-sm font-semibold text-ink">
              Nama Menu <span className="text-danger">*</span>
            </label>
            <input
              id="menu-name"
              type="text"
              required
              placeholder="mis. Nasi Goreng Spesial"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
          </div>

          {/* 2. Kategori (Wajib, Dropdown) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="menu-category" className="text-sm font-semibold text-ink">
              Kategori <span className="text-danger">*</span>
            </label>
            <select
              id="menu-category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Harga (Wajib, Awalan Rp) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="menu-price" className="text-sm font-semibold text-ink">
              Harga (Rupiah) <span className="text-danger">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-ink-muted font-semibold text-sm select-none">
                Rp
              </span>
              <input
                id="menu-price"
                type="number"
                min="0"
                step="500"
                required
                inputMode="numeric"
                placeholder="25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 w-full pl-10 pr-3 rounded-md border border-line-strong bg-surface text-ink text-sm price-tabular focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
              />
            </div>
            <span className="text-xs text-ink-muted">
              Isi 0 untuk menampilkan status &quot;Gratis&quot;.
            </span>
          </div>

          {/* 4. Foto Menu (Opsional, Kompresi Klien) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-line/60">
            <label className="text-sm font-semibold text-ink">
              Foto Menu <span className="text-xs font-normal text-ink-muted">(Opsional)</span>
            </label>

            <div className="flex items-start gap-4">
              {/* Pratinjau Foto */}
              <div className="w-24 h-24 rounded-md bg-sunken border border-line overflow-hidden shrink-0 flex items-center justify-center relative select-none">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Pratinjau"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-ink-muted/60 text-center px-1 font-semibold">
                    Tanpa Foto
                  </span>
                )}
              </div>

              {/* Aksi Unggah */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="sekunder"
                    size="md"
                    loading={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imageUrl ? "Ganti Foto" : "Unggah Foto"}
                  </Button>

                  {imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => setImageUrl(null)}
                      className="text-danger hover:text-danger hover:bg-danger/10"
                    >
                      Hapus Foto
                    </Button>
                  )}
                </div>

                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Format JPG, PNG, atau WebP. Maks 5 MB. Foto otomatis dioptimasi di HP Anda.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Deskripsi Menu (Maks 160 karakter) */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-line/60">
            <div className="flex items-center justify-between">
              <label htmlFor="menu-desc" className="text-sm font-semibold text-ink">
                Deskripsi Singkat <span className="text-xs font-normal text-ink-muted">(Opsional)</span>
              </label>
              <span
                className={`text-xs ${
                  description.length > 160 ? "text-danger font-bold" : "text-ink-muted"
                }`}
              >
                {description.length}/160
              </span>
            </div>
            <textarea
              id="menu-desc"
              rows={3}
              maxLength={160}
              placeholder="Ceritakan rasa, bahan utama, atau tingkat kepedasan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none resize-none"
            />
          </div>

          {/* 6 & 7. Toggle Ketersediaan & Tampil di Situs */}
          <div className="pt-2 border-t border-line/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-ink block">
                  Status Ketersediaan
                </span>
                <span className="text-xs text-ink-muted">
                  Tandai apakah menu ini siap dipesan atau habis hari ini.
                </span>
              </div>
              <Switch
                checked={isAvailable}
                onChange={setIsAvailable}
                label="Status ketersediaan stok"
                statusText={isAvailable ? "Tersedia" : "Habis"}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-line/40">
              <div>
                <span className="text-sm font-semibold text-ink block">
                  Tampilkan di Situs Publik
                </span>
                <span className="text-xs text-ink-muted">
                  Nonaktifkan jika ingin menyembunyikan menu ini tanpa menghapusnya.
                </span>
              </div>
              <Switch
                checked={isActive}
                onChange={setIsActive}
                label="Tampilkan menu di situs"
                statusText={isActive ? "Tampil" : "Sembunyi"}
              />
            </div>
          </div>
        </div>

        {/* Bar Aksi Simpan & Batal */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center h-11 px-5 rounded-md text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
          >
            Batal
          </Link>
          <Button
            type="submit"
            variant="primer"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Menu"}
          </Button>
        </div>

        {/* Tombol Hapus Menu (Mode Edit Saja, Jarak Aman 48px) */}
        {isEdit && (
          <div className="pt-12 text-center">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="text-xs font-semibold text-danger hover:underline cursor-pointer inline-flex items-center gap-1.5"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              <span>Hapus menu ini secara permanen</span>
            </button>
          </div>
        )}
      </form>

      {/* Dialog Konfirmasi Hapus (O2) */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title={`Hapus ${name}?`}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              autoFocus
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="leading-relaxed">
          Tindakan ini tidak bisa dibatalkan. Jika Anda hanya ingin menu tidak tampil sementara, gunakan opsi <strong>&quot;Sembunyikan&quot;</strong> atau ubah stok menjadi <strong>&quot;Habis&quot;</strong>.
        </p>
      </Dialog>
    </div>
  );
}

function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
