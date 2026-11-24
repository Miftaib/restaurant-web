import { getAllCategoriesWithCounts } from "@/actions/category";
import { MenuForm } from "@/components/admin/menu-form";

export const dynamic = "force-dynamic";

export default async function AdminTambahMenuPage() {
  const categories = await getAllCategoriesWithCounts();

  return <MenuForm categories={categories} />;
}
