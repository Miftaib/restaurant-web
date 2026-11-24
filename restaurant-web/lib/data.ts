import { createPublicClient } from "@/lib/supabase/public";
import { type Restaurant, type MenuCategory, type MenuItem, type MenuByCategory } from "@/lib/types";

// ============================================================
// Default data fallback (sesuai 002_seed_data.sql)
// Digunakan saat Supabase belum dikonfigurasi atau jaringan gagal
// ============================================================

export const DEFAULT_RESTAURANT: Restaurant = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  name: "Kedai Nusantara",
  tagline: "Cita rasa rumahan, harga bersahabat",
  about:
    "Kedai Nusantara berdiri sejak 2018 di sudut Jalan Merdeka. Kami menyajikan masakan rumahan Indonesia dengan bahan segar dari pasar lokal setiap pagi. Tempat yang pas untuk makan siang bersama teman atau bawa pulang untuk keluarga.",
  address: "Jl. Merdeka No. 42, Kelurahan Sukamaju, Kecamatan Cilandak, Jakarta Selatan 12430",
  contact_phone: "02112345678",
  whatsapp_number: "6281234567890",
  whatsapp_default_message: "Halo, saya ingin bertanya tentang menu Kedai Nusantara.",
  maps_url: "https://maps.app.goo.gl/contoh123",
  logo_url: null,
  hero_image_url: null,
  instagram: "kedainusantara",
  updated_at: "2026-11-23T08:00:00Z",
};

export const DEFAULT_MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "c0000001-0000-0000-0000-000000000001",
    name: "Makanan Utama",
    sort_order: 1,
    is_active: true,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "c0000002-0000-0000-0000-000000000002",
    name: "Minuman",
    sort_order: 2,
    is_active: true,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "c0000003-0000-0000-0000-000000000003",
    name: "Camilan",
    sort_order: 3,
    is_active: true,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "m0000001-0000-0000-0000-000000000001",
    category_id: "c0000001-0000-0000-0000-000000000001",
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam suwir, kerupuk, dan acar. Pedas bisa diatur.",
    price: 28000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 1,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000001-0000-0000-0000-000000000002",
    category_id: "c0000001-0000-0000-0000-000000000001",
    name: "Mie Ayam Bakso",
    description: "Mie ayam dengan bakso sapi, pangsit goreng, dan kuah kaldu.",
    price: 25000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 2,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000001-0000-0000-0000-000000000003",
    category_id: "c0000001-0000-0000-0000-000000000001",
    name: "Ayam Geprek Sambal Matah",
    description: "Ayam goreng tepung dengan sambal matah segar. Nasi putih terpisah.",
    price: 30000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 3,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000001-0000-0000-0000-000000000004",
    category_id: "c0000001-0000-0000-0000-000000000001",
    name: "Soto Betawi",
    description: "Soto santan dengan daging sapi, kentang, dan tomat. Disajikan dengan nasi dan emping.",
    price: 32000,
    image_url: null,
    is_available: false,
    is_active: true,
    sort_order: 4,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000002-0000-0000-0000-000000000001",
    category_id: "c0000002-0000-0000-0000-000000000002",
    name: "Es Kopi Susu",
    description: "Espresso, susu segar, gula aren. Dingin dan manis pas.",
    price: 22000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 1,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000002-0000-0000-0000-000000000002",
    category_id: "c0000002-0000-0000-0000-000000000002",
    name: "Teh Tarik",
    description: "Teh hitam ditarik dengan susu kental manis.",
    price: 15000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 2,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000002-0000-0000-0000-000000000003",
    category_id: "c0000002-0000-0000-0000-000000000002",
    name: "Jus Alpukat",
    description: "Alpukat segar blended dengan susu cokelat.",
    price: 20000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 3,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000003-0000-0000-0000-000000000001",
    category_id: "c0000003-0000-0000-0000-000000000003",
    name: "Pisang Goreng Keju",
    description: "Pisang raja goreng dengan taburan keju dan susu kental manis.",
    price: 18000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 1,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000003-0000-0000-0000-000000000002",
    category_id: "c0000003-0000-0000-0000-000000000003",
    name: "Kentang Goreng",
    description: "Kentang goreng renyah dengan saus sambal dan mayones.",
    price: 15000,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 2,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "m0000003-0000-0000-0000-000000000003",
    category_id: "c0000003-0000-0000-0000-000000000003",
    name: "Tahu Crispy",
    description: "Tahu putih goreng krispi, disajikan dengan cabai rawit.",
    price: 0,
    image_url: null,
    is_available: true,
    is_active: true,
    sort_order: 3,
    created_at: "2026-11-23T08:00:00Z",
    updated_at: "2026-11-23T08:00:00Z",
  },
];

/**
 * Mengambil profil restoran dari Supabase.
 * Mengembalikan DEFAULT_RESTAURANT jika gagal atau belum terkonfigurasi.
 */
export async function getRestaurant(): Promise<Restaurant> {
  const supabase = createPublicClient();
  if (!supabase) {
    return DEFAULT_RESTAURANT;
  }

  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.warn("Gagal memuat profil restoran dari Supabase, memakai fallback default.", error?.message);
      return DEFAULT_RESTAURANT;
    }

    return data as Restaurant;
  } catch (err) {
    console.warn("Error koneksi Supabase:", err);
    return DEFAULT_RESTAURANT;
  }
}

/**
 * Mengambil kategori aktif dan menu aktif yang dikelompokkan.
 * Menyaring kategori yang tidak memiliki item aktif (FR-2.5).
 */
export async function getMenuCategoriesWithItems(): Promise<MenuByCategory[]> {
  const supabase = createPublicClient();
  if (!supabase) {
    return groupCategoriesAndItems(DEFAULT_MENU_CATEGORIES, DEFAULT_MENU_ITEMS);
  }

  try {
    // 1. Ambil kategori aktif, urutkan sort_order asc
    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (catError || !categories) {
      console.warn("Gagal memuat kategori, memakai data fallback:", catError?.message);
      return groupCategoriesAndItems(DEFAULT_MENU_CATEGORIES, DEFAULT_MENU_ITEMS);
    }

    // 2. Ambil item aktif, urutkan sort_order asc
    const { data: items, error: itemError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (itemError || !items) {
      console.warn("Gagal memuat item menu, memakai data fallback:", itemError?.message);
      return groupCategoriesAndItems(categories as MenuCategory[], DEFAULT_MENU_ITEMS);
    }

    return groupCategoriesAndItems(categories as MenuCategory[], items as MenuItem[]);
  } catch (err) {
    console.warn("Error koneksi menu Supabase:", err);
    return groupCategoriesAndItems(DEFAULT_MENU_CATEGORIES, DEFAULT_MENU_ITEMS);
  }
}

function groupCategoriesAndItems(
  categories: MenuCategory[],
  items: MenuItem[]
): MenuByCategory[] {
  const grouped: MenuByCategory[] = [];

  for (const cat of categories) {
    const catItems = items.filter((item) => item.category_id === cat.id);
    // FR-2.5: Kategori tanpa item aktif tidak ditampilkan di halaman publik
    if (catItems.length > 0) {
      grouped.push({
        category: cat,
        items: catItems,
      });
    }
  }

  return grouped;
}
