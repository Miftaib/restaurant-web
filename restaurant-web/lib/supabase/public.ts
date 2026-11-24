import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client untuk data publik (read-only anon).
 * Tidak mengakses cookies() request sehingga tidak mengunci render
 * dan dapat dicache secara optimal oleh Next.js.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your_supabase_project_url" || key === "your_supabase_anon_key") {
    return null;
  }

  return createClient(url, key);
}
