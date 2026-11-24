"use client";

import { useState } from "react";
import { type CategoryWithCount } from "@/actions/category";
import {
  createCategoryAction,
  updateCategoryAction,
  toggleCategoryVisibilityAction,
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/actions/category";
import { useToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdminCategoryManagerProps {
  initialCategories: CategoryWithCount[];
}

/**
 * A5: Kelola Kategori — Design.md §6 A5, O4, FR-6.5
 * Tambah, ubah nama, aktifkan/nonaktifkan, atur urutan.
 * Proteksi hapus kategori jika masih ada menu (OQ-14).
 */
export function AdminCategoryManager({
  initialCategories,
}: AdminCategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);

  // Modal Sheet O4 (Tambah / Edit Kategori)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Proteksi / Konfirmasi Hapus
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useToast();

  // Buka Modal Tambah Kategori
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryNameInput("");
    setModalOpen(true);
  };

  // Buka Modal Edit Nama
  const handleOpenEdit = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setCategoryNameInput(cat.name);
    setModalOpen(true);
  };

  // Simpan Tambah / Edit Kategori (O4)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Edit nama
        const res = await updateCategoryAction(editingCategory.id, categoryNameInput.trim());
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id ? { ...c, name: categoryNameInput.trim() } : c
            )
          );
          addToast({ type: "success", message: "Nama kategori berhasil diperbarui." });
          setModalOpen(false);
        } else {
          addToast({ type: "error", message: res.error || "Gagal memperbarui nama." });
        }
      } else {
        // Tambah baru
        const res = await createCategoryAction(categoryNameInput.trim());
        if (res.success) {
          const newCat: CategoryWithCount = {
            id: res.id || `temp-${Date.now()}`,
            name: categoryNameInput.trim(),
            sort_order: categories.length + 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            menuCount: 0,
          };
          setCategories((prev) => [...prev, newCat]);
          addToast({ type: "success", message: `Kategori ${newCat.name} berhasil dibuat.` });
          setModalOpen(false);
        } else {
          addToast({ type: "error", message: res.error || "Gagal membuat kategori." });
        }
      }
    } catch {
      addToast({ type: "error", message: "Terjadi kesalahan koneksi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Tampil di Situs
  const handleToggleVisibility = async (cat: CategoryWithCount, newActive: boolean) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_active: newActive } : c))
    );

    try {
      const res = await toggleCategoryVisibilityAction(cat.id, newActive);
      if (res.success) {
        addToast({
          type: "success",
          message: newActive
            ? `Kategori ${cat.name} kini tampil di situs.`
            : `Kategori ${cat.name} disembunyikan dari situs.`,
        });
      } else {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, is_active: !newActive } : c))
        );
        addToast({ type: "error", message: "Gagal memperbarui status kategori." });
      }
    } catch {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: !newActive } : c))
      );
      addToast({ type: "error", message: "Terjadi kesalahan koneksi." });
    }
  };

  // Eksekusi Hapus Kategori
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(deleteTarget.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        addToast({
          type: "success",
          message: `Kategori ${deleteTarget.name} berhasil dihapus.`,
        });
        setDeleteTarget(null);
      } else {
        addToast({
          type: "error",
          message: res.error || "Gagal menghapus kategori.",
        });
      }
    } catch {
      addToast({ type: "error", message: "Terjadi kesalahan koneksi." });
    } finally {
      setIsDeleting(false);
    }
  };

  // Nonaktifkan Kategori (Jalan Keluar Aman jika Kategori ada Menu)
  const handleDeactivateCategory = async () => {
    if (!deleteTarget) return;
    await handleToggleVisibility(deleteTarget, false);
    setDeleteTarget(null);
  };

  // Naikkan Urutan
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const nextList = [...categories];
    const temp = nextList[index - 1];
    nextList[index - 1] = nextList[index];
    nextList[index] = temp;
    setCategories(nextList);

    await reorderCategoriesAction(nextList.map((c) => c.id));
  };

  // Turunkan Urutan
  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const nextList = [...categories];
    const temp = nextList[index + 1];
    nextList[index + 1] = nextList[index];
    nextList[index] = temp;
    setCategories(nextList);

    await reorderCategoriesAction(nextList.map((c) => c.id));
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Tambah Kategori */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Kelola Kategori Menu
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Kelompokkan menu dan atur urutan tampilan di situs utama.
          </p>
        </div>

        <Button
          type="button"
          variant="primer"
          size="md"
          onClick={handleOpenAdd}
          className="w-full sm:w-auto"
        >
          + Tambah Kategori
        </Button>
      </div>

      {/* Daftar Kategori */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="p-4 rounded-lg bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Nama & Jumlah Menu */}
            <div className="flex items-center gap-3">
              {/* Tombol Urutan (Naik/Turun) — US-10 */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-sunken disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Naikkan urutan"
                  aria-label={`Naikkan urutan ${cat.name}`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === categories.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-sunken disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Turunkan urutan"
                  aria-label={`Turunkan urutan ${cat.name}`}
                >
                  ▼
                </button>
              </div>

              <div>
                <h3 className="font-body font-bold text-base text-ink">
                  {cat.name}
                </h3>
                <span className="text-xs text-ink-muted">
                  {cat.menuCount} menu di dalam kategori ini
                </span>
              </div>
            </div>

            {/* Aksi Kategori */}
            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-line/60">
              {/* Switch Tampil di Situs */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted font-medium hidden sm:inline">
                  Tampil:
                </span>
                <Switch
                  checked={cat.is_active}
                  onChange={(val) => handleToggleVisibility(cat, val)}
                  label={`Tampilkan kategori ${cat.name}`}
                  statusText={cat.is_active ? "Tampil" : "Sembunyi"}
                />
              </div>

              {/* Tombol Ubah Nama */}
              <Button
                type="button"
                variant="sekunder"
                size="md"
                onClick={() => handleOpenEdit(cat)}
                className="text-xs h-9 px-3"
              >
                Ubah Nama
              </Button>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={() => setDeleteTarget(cat)}
                className="p-2 rounded text-danger hover:bg-danger/10 transition-colors cursor-pointer text-xs font-semibold"
                aria-label={`Hapus kategori ${cat.name}`}
                title="Hapus Kategori"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sheet O4: Modal Tambah / Ubah Nama Kategori */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Ubah Nama Kategori" : "Tambah Kategori Baru"}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="category-modal-form"
              variant="primer"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Simpan
            </Button>
          </>
        }
      >
        <form id="category-modal-form" onSubmit={handleSaveModal} className="space-y-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cat-name-input" className="text-sm font-semibold text-ink">
              Nama Kategori <span className="text-danger">*</span>
            </label>
            <input
              id="cat-name-input"
              type="text"
              required
              autoFocus
              placeholder="mis. Makanan Penutup, Kopi Spesial"
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
          </div>
        </form>
      </Dialog>

      {/* Dialog Proteksi Hapus Kategori (Design.md OQ-14, FR-6.5) */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={
          deleteTarget && deleteTarget.menuCount > 0
            ? "Kategori Tidak Bisa Dihapus"
            : `Hapus Kategori ${deleteTarget?.name}?`
        }
        actions={
          deleteTarget && deleteTarget.menuCount > 0 ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
              >
                Tutup
              </Button>
              <Button
                type="button"
                variant="sekunder"
                onClick={handleDeactivateCategory}
              >
                Nonaktifkan Kategori Saja
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                autoFocus
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleConfirmDelete}
                loading={isDeleting}
                disabled={isDeleting}
              >
                Hapus
              </Button>
            </>
          )
        }
      >
        {deleteTarget && deleteTarget.menuCount > 0 ? (
          <div className="space-y-2 text-sm text-ink-muted leading-relaxed">
            <p>
              Kategori <strong>{deleteTarget.name}</strong> masih berisi{" "}
              <strong>{deleteTarget.menuCount} menu</strong> aktif.
            </p>
            <p>
              Untuk mencegah menu terhapus tanpa sengaja, Anda dapat menyembunyikan kategori ini dari situs publik dengan menekan tombol <strong>&quot;Nonaktifkan Kategori Saja&quot;</strong>.
            </p>
          </div>
        ) : (
          <p className="text-sm text-ink-muted leading-relaxed">
            Apakah Anda yakin ingin menghapus kategori <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
        )}
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
