import { getAllCategoriesWithCounts } from "@/actions/category";
import { AdminCategoryManager } from "@/components/admin/admin-category-manager";

export const dynamic = "force-dynamic";

/**
 * A5: Halaman Kelola Kategori Menu — Design.md §6 A5
 */
export default async function AdminKategoriPage() {
  const categories = await getAllCategoriesWithCounts();

  return <AdminCategoryManager initialCategories={categories} />;
}
