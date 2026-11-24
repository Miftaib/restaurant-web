import { getMenuCategoriesWithItems } from "@/lib/data";
import { AdminMenuList } from "@/components/admin/admin-menu-list";

export const dynamic = "force-dynamic";

/**
 * A3: Halaman Utama Admin — Daftar Menu (Design.md §4, §6 A3)
 * Menampilkan semua menu, 1-tap stock toggle, ubah harga cepat, dan aksi menu.
 */
export default async function AdminHomePage() {
  const categories = await getMenuCategoriesWithItems();

  return <AdminMenuList initialCategories={categories} />;
}
