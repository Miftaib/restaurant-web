"use client";

import { useState } from "react";
import Link from "next/link";
import { type MenuItem, type MenuCategory } from "@/lib/types";
import { AdminMenuRow } from "@/components/admin/admin-menu-row";
import { QuickPriceModal } from "@/components/admin/quick-price-modal";
import { Button } from "@/components/ui/button";

interface CategoryWithItems {
  category: MenuCategory;
  items: MenuItem[];
}

interface AdminMenuListProps {
  initialCategories: CategoryWithItems[];
}

/**
 * A3: Daftar Menu Admin — Design.md §6 A3
 * Header: Judul "Menu", tombol "+ Tambah menu"
 * Filter Kategori (Chips)
 * Daftar menu per kategori dengan aksi cepat & 1-tap stock toggle
 */
export function AdminMenuList({ initialCategories }: AdminMenuListProps) {
  const [data, setData] = useState<CategoryWithItems[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quickPriceItem, setQuickPriceItem] = useState<MenuItem | null>(null);

  // Filter kategori
  const displayedCategories = data
    .filter((cat) => selectedCategory === "all" || cat.category.id === selectedCategory)
    .filter((cat) => cat.items.length > 0);

  const totalItemsCount = data.reduce((acc, cat) => acc + cat.items.length, 0);

  const handlePriceUpdated = (id: string, newPrice: number) => {
    setData((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === id ? { ...item, price: newPrice } : item
        ),
      }))
    );
  };

  const handleItemDeleted = (id: string) => {
    setData((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.id !== id),
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Tombol Tambah Menu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Menu Makanan & Minuman
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Ubah status stok, harga, dan kelola menu yang tampil di situs.
          </p>
        </div>

        <Link
          href="/admin/menu/baru"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-ink text-paper text-sm font-semibold hover:bg-ink/90 active:bg-ink/80 transition-colors w-full sm:w-auto shadow-xs"
        >
          <span>+ Tambah Menu</span>
        </Link>
      </div>

      {/* 2. Filter Kategori (Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`
            shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer
            ${
              selectedCategory === "all"
                ? "bg-brand text-brand-ink shadow-xs"
                : "bg-surface border border-line text-ink-muted hover:text-ink hover:border-ink"
            }
          `}
        >
          Semua ({totalItemsCount})
        </button>

        {data.map(({ category, items }) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`
              shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer
              ${
                selectedCategory === category.id
                  ? "bg-brand text-brand-ink shadow-xs"
                  : "bg-surface border border-line text-ink-muted hover:text-ink hover:border-ink"
              }
            `}
          >
            {category.name} ({items.length})
          </button>
        ))}
      </div>

      {/* 3. Daftar Menu per Kategori */}
      {displayedCategories.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-surface border border-line space-y-3">
          <p className="font-display text-lg font-bold text-ink">
            Belum ada menu di kategori ini.
          </p>
          <p className="text-xs text-ink-muted">
            Tambahkan menu pertama Anda untuk mulai mengisi daftar.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/menu/baru"
              className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-ink text-paper text-xs font-semibold hover:bg-ink/90"
            >
              + Tambah Menu Pertama
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedCategories.map(({ category, items }) => (
            <div key={category.id} className="space-y-3">
              {/* Heading Kategori Sticky Ringan */}
              <div className="flex items-center justify-between border-b border-line pb-1.5 sticky top-14 md:top-0 bg-paper/95 backdrop-blur-sm z-10 py-1">
                <h2 className="font-display text-base sm:text-lg font-bold text-ink">
                  {category.name}
                </h2>
                <span className="text-xs text-ink-muted font-medium">
                  {items.length} menu
                </span>
              </div>

              {/* Baris-baris menu */}
              <div className="space-y-2">
                {items.map((item) => (
                  <AdminMenuRow
                    key={item.id}
                    item={item}
                    categoryName={category.name}
                    onOpenQuickPrice={setQuickPriceItem}
                    onItemDeleted={handleItemDeleted}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ubah Harga Cepat (O1) */}
      <QuickPriceModal
        item={quickPriceItem}
        onClose={() => setQuickPriceItem(null)}
        onPriceUpdated={handlePriceUpdated}
      />
    </div>
  );
}
