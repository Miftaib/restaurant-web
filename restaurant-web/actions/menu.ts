"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type MenuItem } from "@/lib/types";

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

/**
 * 1-Tap Stock Toggle — FR-7, Design.md §5 J3
 * Mengubah ketersediaan menu (is_available) secara instan.
 */
export async function toggleStockAction(
  id: string,
  newStatus: boolean
): Promise<{ success: boolean; isAvailable: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Mode offline / mock
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, isAvailable: newStatus };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggle stock:", error);
      return { success: false, isAvailable: !newStatus, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, isAvailable: newStatus };
  } catch (err) {
    console.error("Toggle stock unexpected error:", err);
    return {
      success: false,
      isAvailable: !newStatus,
      error: "Gagal terhubung ke database.",
    };
  }
}

/**
 * Toggle Tampil di Situs (is_active) — Design.md A4
 */
export async function toggleMenuVisibilityAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status tampil." };
  }
}

/**
 * Ubah Harga Cepat — Design.md O1
 */
export async function updateMenuPriceAction(
  id: string,
  price: number
): Promise<{ success: boolean; error?: string }> {
  if (price < 0 || isNaN(price)) {
    return { success: false, error: "Harga tidak valid." };
  }

  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ price: Math.round(price) })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui harga." };
  }
}

/**
 * Simpan / Tambah / Ubah Menu — FR-6, Design.md A4
 */
export async function saveMenuItemAction(
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  const categoryId = formData.get("category_id") as string;
  const priceRaw = formData.get("price") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = (formData.get("image_url") as string)?.trim() || null;
  const isAvailable = formData.get("is_available") === "true";
  const isActive = formData.get("is_active") !== "false";

  if (!name) {
    return { success: false, error: "Nama menu wajib diisi." };
  }

  if (!categoryId) {
    return { success: false, error: "Pilih kategori menu." };
  }

  const price = parseInt(priceRaw, 10);
  if (isNaN(price) || price < 0) {
    return { success: false, error: "Harga harus berupa angka bulat ≥ 0." };
  }

  if (description && description.length > 160) {
    return { success: false, error: "Deskripsi maksimal 160 karakter." };
  }

  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, id: id || "mock-new-id" };
  }

  try {
    const supabase = await createClient();

    if (id) {
      // Mode Edit
      const { error } = await supabase
        .from("menu_items")
        .update({
          name,
          category_id: categoryId,
          price,
          description,
          image_url: imageUrl,
          is_available: isAvailable,
          is_active: isActive,
        })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Mode Tambah Baru
      // Ambil sort_order terbesar
      const { data: lastItem } = await supabase
        .from("menu_items")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextSortOrder = (lastItem?.sort_order ?? 0) + 1;

      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name,
          category_id: categoryId,
          price,
          description,
          image_url: imageUrl,
          is_available: isAvailable,
          is_active: isActive,
          sort_order: nextSortOrder,
        })
        .select("id")
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true, id: data?.id };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, id };
  } catch (err) {
    console.error("Save menu item unexpected error:", err);
    return { success: false, error: "Gagal menyimpan menu. Periksa koneksi." };
  }
}

/**
 * Hapus Menu — Design.md O2
 */
export async function deleteMenuItemAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus menu." };
  }
}

/**
 * Upload Foto Menu ke Supabase Storage (Bucket 'images') — FR-6.3, Design.md OQ-10
 */
export async function uploadMenuPhotoAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "Tidak ada file yang diunggah." };
  }

  if (!isSupabaseConfigured()) {
    // Jika belum ada Supabase Storage, baca sebagai Data URL lokal untuk pratinjau dev
    try {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return { success: true, url: dataUrl };
    } catch {
      return { success: false, error: "Gagal membaca file gambar." };
    }
  }

  try {
    const supabase = await createClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `menu/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: file.type || "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Storage upload error:", uploadError.message);
      // Fallback ke data URL agar pengguna tidak terhambat
      const base64 = Buffer.from(bytes).toString("base64");
      return {
        success: true,
        url: `data:${file.type};base64,${base64}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Upload photo unexpected error:", err);
    return { success: false, error: "Gagal mengunggah foto." };
  }
}

/**
 * Mengambil satu menu item berdasarkan ID (untuk mode edit A4)
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data as MenuItem;
  } catch {
    return null;
  }
}
