"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type MenuCategory } from "@/lib/types";
import { DEFAULT_MENU_CATEGORIES } from "@/lib/data";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    url !== "your_supabase_project_url" &&
    key !== "your_supabase_anon_key"
  );
}

export interface CategoryWithCount extends MenuCategory {
  menuCount: number;
}

/**
 * Mengambil semua kategori (termasuk yang tidak aktif) beserta jumlah menu di dalamnya.
 */
export async function getAllCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_MENU_CATEGORIES.map((cat) => ({
      ...cat,
      menuCount: cat.name === "Makanan Utama" ? 4 : cat.name === "Minuman" ? 3 : 3,
    }));
  }

  try {
    const supabase = await createClient();

    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (catError || !categories) {
      return DEFAULT_MENU_CATEGORIES.map((cat) => ({ ...cat, menuCount: 3 }));
    }

    const { data: items } = await supabase
      .from("menu_items")
      .select("category_id");

    const counts: Record<string, number> = {};
    items?.forEach((item) => {
      counts[item.category_id] = (counts[item.category_id] || 0) + 1;
    });

    return (categories as MenuCategory[]).map((cat) => ({
      ...cat,
      menuCount: counts[cat.id] || 0,
    }));
  } catch {
    return DEFAULT_MENU_CATEGORIES.map((cat) => ({ ...cat, menuCount: 3 }));
  }
}

/**
 * Tambah Kategori Baru — Design.md A5, O4
 */
export async function createCategoryAction(
  name: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { success: false, error: "Nama kategori wajib diisi." };
  }

  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true, id: "mock-cat-id" };
  }

  try {
    const supabase = await createClient();

    const { data: lastCat } = await supabase
      .from("menu_categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (lastCat?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        name: trimmed,
        sort_order: nextOrder,
        is_active: true,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true, id: data?.id };
  } catch {
    return { success: false, error: "Gagal membuat kategori baru." };
  }
}

/**
 * Ubah Nama Kategori — Design.md A5, O4
 */
export async function updateCategoryAction(
  id: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { success: false, error: "Nama kategori wajib diisi." };
  }

  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("menu_categories")
      .update({ name: trimmed })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui nama kategori." };
  }
}

/**
 * Toggle Status Tampil Kategori di Situs (is_active)
 */
export async function toggleCategoryVisibilityAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("menu_categories")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status kategori." };
  }
}

/**
 * Hapus Kategori dengan Proteksi Relasi — FR-6.5, Design.md OQ-14
 * Jika kategori masih berisi menu, aksi penghapusan diblokir dengan pesan informatif
 * dan saran untuk menonaktifkan kategori.
 */
export async function deleteCategoryAction(
  id: string
): Promise<{ success: boolean; error?: string; menuCount?: number }> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  }

  try {
    const supabase = await createClient();

    // 1. Cek apakah kategori masih memiliki menu
    const { count, error: countError } = await supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return {
        success: false,
        menuCount: count,
        error: `Kategori ini masih berisi ${count} menu. Anda dapat menonaktifkannya dari situs atau memindahkan menu terlebih dahulu.`,
      };
    }

    // 2. Hapus kategori jika kosong
    const { error: deleteError } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus kategori." };
  }
}

/**
 * Atur Urutan Kategori (sort_order) — US-10
 */
export async function reorderCategoriesAction(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  }

  try {
    const supabase = await createClient();

    // Update berurutan
    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await supabase
        .from("menu_categories")
        .update({ sort_order: index + 1 })
        .eq("id", id);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menyimpan urutan kategori." };
  }
}
