import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware Supabase: refresh session & proteksi /admin.
 * Dipanggil oleh middleware.ts di root.
 */
export async function updateSession(request: NextRequest) {
  // Skip jika env vars belum diisi (development awal)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === "your_supabase_project_url") {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session (penting — jangan hapus)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteksi halaman admin — redirect ke login jika belum auth
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/masuk";
  const isResetRoute = request.nextUrl.pathname === "/admin/lupa-sandi";

  if (isAdminRoute && !isLoginRoute && !isResetRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/masuk";
    return NextResponse.redirect(url);
  }

  // Jika sudah login dan akses halaman login, redirect ke admin
  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
