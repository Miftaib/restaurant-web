import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/data";
import { AdminShell } from "@/components/admin/admin-shell";

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
 * Layout Admin Dashboard (Fase 2)
 * Melindungi semua rute di dalam (dashboard): /admin, /admin/menu, /admin/kategori, /admin/profil.
 * Mengecek sesi autentikasi dan meneruskan info restoran ke AdminShell.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | undefined = undefined;

  // Proteksi autentikasi di server
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/admin/masuk");
      }

      userEmail = user.email;
    } catch {
      redirect("/admin/masuk");
    }
  }

  const restaurant = await getRestaurant();

  return (
    <AdminShell restaurant={restaurant} userEmail={userEmail}>
      {children}
    </AdminShell>
  );
}
