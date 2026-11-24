import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk browser (Client Components).
 * Dipakai di komponen interaktif: toggle stok, form, dll.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
