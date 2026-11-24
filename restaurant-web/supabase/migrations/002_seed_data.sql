-- ========================================
-- Seed Data — Data dummy untuk development
-- 1 restoran, 3 kategori, 10 menu items
-- ========================================

-- Restoran
insert into public.restaurants (id, name, tagline, about, address, contact_phone, whatsapp_number, whatsapp_default_message, maps_url, instagram)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Kedai Nusantara',
  'Cita rasa rumahan, harga bersahabat',
  'Kedai Nusantara berdiri sejak 2018 di sudut Jalan Merdeka. Kami menyajikan masakan rumahan Indonesia dengan bahan segar dari pasar lokal setiap pagi. Tempat yang pas untuk makan siang bersama teman atau bawa pulang untuk keluarga.',
  'Jl. Merdeka No. 42, Kelurahan Sukamaju, Kecamatan Cilandak, Jakarta Selatan 12430',
  '02112345678',
  '6281234567890',
  'Halo, saya ingin bertanya tentang menu Kedai Nusantara.',
  'https://maps.app.goo.gl/contoh123',
  'kedainusantara'
);

-- Kategori
insert into public.menu_categories (id, name, sort_order, is_active) values
  ('c0000001-0000-0000-0000-000000000001', 'Makanan Utama', 1, true),
  ('c0000002-0000-0000-0000-000000000002', 'Minuman', 2, true),
  ('c0000003-0000-0000-0000-000000000003', 'Camilan', 3, true);

-- Menu Items — Makanan Utama
insert into public.menu_items (category_id, name, description, price, is_available, sort_order) values
  ('c0000001-0000-0000-0000-000000000001', 'Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam suwir, kerupuk, dan acar. Pedas bisa diatur.', 28000, true, 1),
  ('c0000001-0000-0000-0000-000000000001', 'Mie Ayam Bakso', 'Mie ayam dengan bakso sapi, pangsit goreng, dan kuah kaldu.', 25000, true, 2),
  ('c0000001-0000-0000-0000-000000000001', 'Ayam Geprek Sambal Matah', 'Ayam goreng tepung dengan sambal matah segar. Nasi putih terpisah.', 30000, true, 3),
  ('c0000001-0000-0000-0000-000000000001', 'Soto Betawi', 'Soto santan dengan daging sapi, kentang, dan tomat. Disajikan dengan nasi dan emping.', 32000, false, 4);

-- Menu Items — Minuman
insert into public.menu_items (category_id, name, description, price, is_available, sort_order) values
  ('c0000002-0000-0000-0000-000000000002', 'Es Kopi Susu', 'Espresso, susu segar, gula aren. Dingin dan manis pas.', 22000, true, 1),
  ('c0000002-0000-0000-0000-000000000002', 'Teh Tarik', 'Teh hitam ditarik dengan susu kental manis.', 15000, true, 2),
  ('c0000002-0000-0000-0000-000000000002', 'Jus Alpukat', 'Alpukat segar blended dengan susu cokelat.', 20000, true, 3);

-- Menu Items — Camilan
insert into public.menu_items (category_id, name, description, price, is_available, sort_order) values
  ('c0000003-0000-0000-0000-000000000003', 'Pisang Goreng Keju', 'Pisang raja goreng dengan taburan keju dan susu kental manis.', 18000, true, 1),
  ('c0000003-0000-0000-0000-000000000003', 'Kentang Goreng', 'Kentang goreng renyah dengan saus sambal dan mayones.', 15000, true, 2),
  ('c0000003-0000-0000-0000-000000000003', 'Tahu Crispy', 'Tahu putih goreng krispi, disajikan dengan cabai rawit.', 0, true, 3);
