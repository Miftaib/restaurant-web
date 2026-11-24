"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  success?: boolean;
  message?: string;
}

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
 * Server Action: Masuk Admin (Design.md A1, §5 J3)
 */
export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Kunci Supabase belum diisi. Masukkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local Anda terlebih dahulu.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Design.md §8: Pesan umum agar tidak membocorkan keberadaan akun
      const msg = error.message.toLowerCase();
      if (
        msg.includes("invalid login credentials") ||
        msg.includes("invalid credential") ||
        msg.includes("user not found")
      ) {
        return { error: "Email atau kata sandi salah." };
      }

      if (msg.includes("rate limit") || msg.includes("too many requests")) {
        return { error: "Terlalu banyak percobaan. Coba lagi dalam 5 menit." };
      }

      return { error: error.message || "Gagal masuk. Periksa kembali data Anda." };
    }
  } catch (err) {
    console.error("Login unexpected error:", err);
    return { error: "Tidak bisa terhubung ke server autentikasi. Coba lagi." };
  }

  redirect("/admin");
}

/**
 * Server Action: Lupa Kata Sandi (Design.md A2, §5 J9)
 */
export async function resetPasswordAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { error: "Masukkan alamat email Anda." };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Kunci Supabase belum diisi di .env.local. Silakan masukkan kredensial Supabase Anda terlebih dahulu.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.warn("Reset password error:", error.message);
    }

    // Design.md §5 J9: Selalu berikan pesan netral agar tidak membocorkan akun
    return {
      success: true,
      message:
        "Jika email Anda terdaftar sebagai admin, tautan untuk mengatur ulang kata sandi telah dikirim ke kotak masuk email Anda.",
    };
  } catch (err) {
    console.error("Reset password unexpected error:", err);
    return { error: "Gagal memproses permintaan. Periksa koneksi Anda." };
  }
}

/**
 * Server Action: Keluar / Logout
 */
export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  redirect("/admin/masuk");
}
