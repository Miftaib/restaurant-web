"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateMenuPriceAction } from "@/actions/menu";
import { useToast } from "@/components/ui/toast";
import { formatRupiah } from "@/lib/format";
import { type MenuItem } from "@/lib/types";

interface QuickPriceModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onPriceUpdated?: (id: string, newPrice: number) => void;
}

/**
 * O1: Sheet / Dialog Ubah Harga Cepat — Design.md §6 O1
 * Membuka keypad angka dengan harga lama terisi dan terpilih.
 * Menyimpan perubahan dalam ≤ 2 ketukan tanpa membuka form penuh.
 */
export function QuickPriceModal({
  item,
  onClose,
  onPriceUpdated,
}: QuickPriceModalProps) {
  const [price, setPrice] = useState<string>(item ? item.price.toString() : "0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice < 0) {
      addToast({
        type: "error",
        message: "Harga harus berupa angka bulat positif.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateMenuPriceAction(item.id, numPrice);
      if (res.success) {
        addToast({
          type: "success",
          message: `Harga ${item.name} diperbarui menjadi ${formatRupiah(numPrice)}.`,
        });
        if (onPriceUpdated) onPriceUpdated(item.id, numPrice);
        onClose();
      } else {
        addToast({
          type: "error",
          message: res.error || "Gagal memperbarui harga.",
        });
      }
    } catch {
      addToast({
        type: "error",
        message: "Terjadi kesalahan koneksi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={Boolean(item)}
      onClose={onClose}
      title={`Ubah Harga: ${item.name}`}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="quick-price-form"
            variant="primer"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Simpan
          </Button>
        </>
      }
    >
      <form id="quick-price-form" onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quick-price-input" className="text-sm font-semibold text-ink">
            Harga Baru (Rupiah)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-ink-muted font-semibold text-sm select-none">
              Rp
            </span>
            <input
              id="quick-price-input"
              type="number"
              min="0"
              step="500"
              required
              autoFocus
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-md border border-line-strong bg-surface text-ink text-lg font-semibold price-tabular focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
          </div>
          <span className="text-xs text-ink-muted">
            Isi 0 untuk menampilkan status &quot;Gratis&quot;.
          </span>
        </div>
      </form>
    </Dialog>
  );
}
