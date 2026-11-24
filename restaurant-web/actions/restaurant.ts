"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MAX_ABOUT_LENGTH } from "@/lib/constants";

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
 * Server Action: Perbarui Profil Restoran — FR-8, Design.md A6
 */
export async function updateRestaurantAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const tagline = (formData.get("tagline") as string)?.trim() || null;
  const about = (formData.get("about") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim();
  const contactPhone = (formData.get("contact_phone") as string)?.trim() || null;
  const rawWa = (formData.get("whatsapp_number") as string)?.trim();
  const waMessage = (formData.get("whatsapp_default_message") as string)?.trim() || null;
  const mapsUrl = (formData.get("maps_url") as string)?.trim() || null;
  const logoUrl = (formData.get("logo_url") as string)?.trim() || null;
  const heroImageUrl = (formData.get("hero_image_url") as string)?.trim() || null;
  const rawInstagram = (formData.get("instagram") as string)?.trim();

  // Validasi bidang wajib (FR-8.2)
  if (!name) {
    return { success: false, error: "Nama restoran wajib diisi." };
  }

  if (!address) {
    return { success: false, error: "Alamat restoran wajib diisi." };
  }

  if (about && about.length > MAX_ABOUT_LENGTH) {
    return {
      success: false,
      error: `Deskripsi Tentang Kami maksimal ${MAX_ABOUT_LENGTH} karakter.`,
    };
  }

  // Sanitasi nomor WhatsApp ke format internasional 628... (FR-3.3)
  let whatsappNumber: string | null = null;
  if (rawWa) {
    let clean = rawWa.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    } else if (!clean.startsWith("62")) {
      clean = "62" + clean;
    }

    if (clean.length < 10 || clean.length > 15) {
      return {
        success: false,
        error: "Nomor WhatsApp tidak valid. Masukkan nomor HP aktif (mis. 81234567890).",
      };
    }
    whatsappNumber = clean;
  }

  // Sanitasi username Instagram (hapus @ jika dimasukkan)
  const instagram = rawInstagram ? rawInstagram.replace(/^@/, "").trim() || null : null;

  if (!isSupabaseConfigured()) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/profil");
    return { success: true };
  }

  try {
    const supabase = await createClient();

    // Perbarui baris restoran
    const { error } = await supabase
      .from("restaurants")
      .update({
        name,
        tagline,
        about,
        address,
        contact_phone: contactPhone,
        whatsapp_number: whatsappNumber,
        whatsapp_default_message: waMessage,
        maps_url: mapsUrl,
        logo_url: logoUrl,
        hero_image_url: heroImageUrl,
        instagram,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Update restaurant error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/profil");
    return { success: true };
  } catch (err) {
    console.error("Update restaurant unexpected error:", err);
    return { success: false, error: "Gagal menyimpan perubahan profil kedai." };
  }
}

/**
 * Upload Asset Restoran (Logo / Hero Image) ke Supabase Storage (Bucket 'images')
 */
export async function uploadRestaurantAssetAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "Tidak ada file yang diunggah." };
  }

  if (!isSupabaseConfigured()) {
    try {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      return { success: true, url: `data:${file.type};base64,${base64}` };
    } catch {
      return { success: false, error: "Gagal membaca file gambar." };
    }
  }

  try {
    const supabase = await createClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `restaurant/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: file.type || "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Storage upload error:", uploadError.message);
      const base64 = Buffer.from(bytes).toString("base64");
      return { success: true, url: `data:${file.type};base64,${base64}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch {
    return { success: false, error: "Gagal mengunggah gambar ke storage." };
  }
}
