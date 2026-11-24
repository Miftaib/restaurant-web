"use client";

import { useState } from "react";
import Link from "next/link";
import { type MenuItem } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { toggleStockAction, toggleMenuVisibilityAction, deleteMenuItemAction } from "@/actions/menu";
import { useToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdminMenuRowProps {
  item: MenuItem;
  categoryName: string;
  onOpenQuickPrice: (item: MenuItem) => void;
  onItemDeleted?: (id: string) => void;
}

/**
 * AdminMenuRow — Design.md §6 A3, §7 AdminMenuRow
 * Baris dua garis:
 * Garis 1: Foto 48px, Nama menu (link ke form edit), dan Switch stok 48x28 (Tersedia/Habis).
 * Garis 2: Kategori · Harga (tombol sheet O1), Chip Disembunyikan, dan Menu Aksi ⋯.
 */
export function AdminMenuRow({
  item,
  categoryName,
  onOpenQuickPrice,
  onItemDeleted,
}: AdminMenuRowProps) {
  const [isAvailable, setIsAvailable] = useState<boolean>(item.is_available);
  const [isActive, setIsActive] = useState<boolean>(item.is_active);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const { addToast } = useToast();
  const initial = item.name ? item.name.charAt(0).toUpperCase() : "?";

  // 1-Tap Stock Toggle dengan Optimistic Update & Opsi Urungkan (Design.md §5 J3)
  const handleToggleStock = async (newChecked: boolean) => {
    const previousState = isAvailable;

    // 1. Optimistic Update UI
    setIsAvailable(newChecked);
    setIsHighlight(true);
    setTimeout(() => setIsHighlight(false), 2000);

    const actionText = newChecked ? "Tersedia" : "Habis";

    // 2. Tampilkan Toast dengan Opsi Urungkan (8 detik)
    addToast({
      type: "success",
      message: `${item.name} ditandai ${actionText}.`,
      action: {
        label: "Urungkan",
        onClick: async () => {
          setIsAvailable(previousState);
          await toggleStockAction(item.id, previousState);
        },
      },
    });

    // 3. Simpan ke database
    setIsStockLoading(true);
    try {
      const res = await toggleStockAction(item.id, newChecked);
      if (!res.success) {
        // Rollback jika gagal
        setIsAvailable(previousState);
        addToast({
          type: "error",
          message: "Gagal menyimpan status stok. Coba lagi.",
        });
      }
    } catch {
      setIsAvailable(previousState);
      addToast({
        type: "error",
        message: "Gagal menyimpan. Periksa koneksi internet.",
      });
    } finally {
      setIsStockLoading(false);
    }
  };

  // Toggle Sembunyikan dari Situs
  const handleToggleVisibility = async () => {
    const newActive = !isActive;
    setIsActive(newActive);
    setShowActionMenu(false);

    try {
      const res = await toggleMenuVisibilityAction(item.id, newActive);
      if (res.success) {
        addToast({
          type: "success",
          message: newActive
            ? `${item.name} kini tampil di situs.`
            : `${item.name} disembunyikan dari situs.`,
        });
      } else {
        setIsActive(!newActive);
        addToast({ type: "error", message: "Gagal mengubah status tampil." });
      }
    } catch {
      setIsActive(!newActive);
      addToast({ type: "error", message: "Gagal menyimpan perubahan." });
    }
  };

  // Hapus Menu (O2)
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteMenuItemAction(item.id);
      if (res.success) {
        addToast({
          type: "success",
          message: `Menu ${item.name} berhasil dihapus.`,
        });
        if (onItemDeleted) onItemDeleted(item.id);
        setShowDeleteDialog(false);
      } else {
        addToast({ type: "error", message: res.error || "Gagal menghapus menu." });
      }
    } catch {
      addToast({ type: "error", message: "Gagal menghapus menu. Periksa koneksi." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`
          py-3.5 px-3 rounded-lg border transition-all duration-300
          ${
            isHighlight
              ? "bg-brand-tint/40 border-brand/40 shadow-xs"
              : "bg-surface border-line hover:border-line-strong/60"
          }
        `}
      >
        {/* Garis 1: Foto 48px, Nama Menu, dan Switch Stok */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Foto 48x48 atau Monogram */}
            <div className="w-12 h-12 rounded-md bg-sunken border border-line shrink-0 overflow-hidden flex items-center justify-center select-none">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display font-semibold text-lg text-ink-muted/60">
                  {initial}
                </span>
              )}
            </div>

            {/* Nama Menu (Klik untuk edit di A4) */}
            <div className="min-w-0">
              <Link
                href={`/admin/menu/${item.id}`}
                className="font-body font-bold text-base text-ink hover:text-brand transition-colors truncate block"
              >
                {item.name}
              </Link>

              {/* Status jika disembunyikan */}
              {!isActive && (
                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sunken text-ink-muted border border-line">
                  Disembunyikan dari situs
                </span>
              )}
            </div>
          </div>

          {/* Switch Stok (Tersedia / Habis) */}
          <div className="shrink-0">
            <Switch
              checked={isAvailable}
              onChange={handleToggleStock}
              label={`Ubah status stok ${item.name}`}
              statusText={isAvailable ? "Tersedia" : "Habis"}
              loading={isStockLoading}
            />
          </div>
        </div>

        {/* Garis 2: Kategori · Harga (Tombol O1) · Menu Aksi ⋯ */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-line/60 text-xs">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="font-medium">{categoryName}</span>
            <span>·</span>
            {/* Tombol Klik Harga untuk Ubah Cepat (Sheet O1) */}
            <button
              type="button"
              onClick={() => onOpenQuickPrice(item)}
              className="font-semibold text-ink hover:text-brand transition-colors price-tabular underline underline-offset-2 decoration-line-strong/60 hover:decoration-brand cursor-pointer"
              title="Klik untuk ubah harga cepat"
            >
              {formatRupiah(item.price)}
            </button>
          </div>

          {/* Menu Aksi ⋯ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-1 rounded text-ink-muted hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
              aria-label="Aksi lainnya"
            >
              <MoreHorizontalIcon className="w-4 h-4" />
            </button>

            {/* Dropdown Menu Aksi */}
            {showActionMenu && (
              <div
                className="absolute right-0 bottom-full mb-1 w-44 bg-surface rounded-md border border-line shadow-[var(--e2)] py-1 z-30 text-xs"
                onMouseLeave={() => setShowActionMenu(false)}
              >
                <Link
                  href={`/admin/menu/${item.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-ink hover:bg-sunken transition-colors"
                  onClick={() => setShowActionMenu(false)}
                >
                  <EditIcon className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Ubah Detail Menu</span>
                </Link>

                <button
                  type="button"
                  onClick={handleToggleVisibility}
                  className="w-full flex items-center gap-2 px-3 py-2 text-ink hover:bg-sunken transition-colors text-left cursor-pointer"
                >
                  <EyeIcon className="w-3.5 h-3.5 text-ink-muted" />
                  <span>{isActive ? "Sembunyikan" : "Tampilkan di Situs"}</span>
                </button>

                <div className="border-t border-line my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowActionMenu(false);
                    setShowDeleteDialog(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-danger hover:bg-danger/10 transition-colors text-left cursor-pointer font-semibold"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Hapus Menu</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus (O2) */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title={`Hapus ${item.name}?`}
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
          Tindakan ini tidak bisa dibatalkan. Jika Anda hanya ingin menu tidak dapat dipesan pengunjung sementara waktu, Anda cukup mengubah statusnya menjadi <strong>&quot;Habis&quot;</strong>.
        </p>
      </Dialog>
    </>
  );
}

function MoreHorizontalIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function EditIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function EyeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
