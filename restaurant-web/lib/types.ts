// ========================================
// TypeScript types — dari PRD §7 Data Model
// ========================================

export interface Restaurant {
  id: string;
  name: string;
  tagline: string | null;
  about: string | null;
  address: string;
  contact_phone: string | null;
  whatsapp_number: string | null;
  whatsapp_default_message: string | null;
  maps_url: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  instagram: string | null;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number; // integer, Rupiah, tanpa desimal
  image_url: string | null;
  is_available: boolean; // true = tersedia, false = habis
  is_active: boolean; // soft hide dari situs
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Menu item dengan info kategori (untuk tampilan publik)
export interface MenuItemWithCategory extends MenuItem {
  category: MenuCategory;
}

// Menu dikelompokkan per kategori (untuk halaman publik)
export interface MenuByCategory {
  category: MenuCategory;
  items: MenuItem[];
}
