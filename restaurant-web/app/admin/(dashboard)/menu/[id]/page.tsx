import Link from "next/link";
import { getAllCategoriesWithCounts } from "@/actions/category";
import { getMenuItemById } from "@/actions/menu";
import { MenuForm } from "@/components/admin/menu-form";

export const dynamic = "force-dynamic";

interface EditMenuPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditMenuPage({ params }: EditMenuPageProps) {
  const { id } = await params;
  const [categories, item] = await Promise.all([
    getAllCategoriesWithCounts(),
    getMenuItemById(id),
  ]);

  if (!item) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">
          Menu Tidak Ditemukan
        </h1>
        <p className="text-xs text-ink-muted">
          Menu yang ingin Anda ubah tidak ada atau telah dihapus sebelumnya.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-ink text-paper text-xs font-semibold hover:bg-ink/90 transition-colors"
        >
          ← Kembali ke Daftar Menu
        </Link>
      </div>
    );
  }

  return <MenuForm categories={categories} initialData={item} />;
}
