-- ========================================
-- Migration 001: Initial Schema
-- Berdasarkan PRD §7 Data Model
-- ========================================

-- ===== TABEL RESTORAN =====
-- Satu baris saja (single-tenant, OQ-1)
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  about text,
  address text not null,
  contact_phone text,
  whatsapp_number text,
  whatsapp_default_message text default 'Halo, saya ingin bertanya tentang menu.',
  maps_url text,
  logo_url text,
  hero_image_url text,
  instagram text,
  updated_at timestamptz not null default now()
);

-- ===== TABEL KATEGORI MENU =====
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== TABEL ITEM MENU =====
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  name text not null,
  description text,
  price integer not null check (price >= 0),  -- Rupiah, tanpa desimal
  image_url text,
  is_available boolean not null default true,  -- tersedia/habis
  is_active boolean not null default true,     -- soft hide
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index untuk query publik
create index idx_menu_items_category on public.menu_items(category_id);
create index idx_menu_items_active on public.menu_items(is_active, sort_order);
create index idx_menu_categories_active on public.menu_categories(is_active, sort_order);

-- ===== ROW LEVEL SECURITY =====
-- Prinsip: baca publik, tulis hanya admin terautentikasi (PRD FR-5.4)

-- Restaurants
alter table public.restaurants enable row level security;

create policy "Publik bisa baca restoran"
  on public.restaurants for select
  to anon, authenticated
  using (true);

create policy "Admin bisa ubah restoran"
  on public.restaurants for update
  to authenticated
  using (true)
  with check (true);

-- Menu Categories
alter table public.menu_categories enable row level security;

create policy "Publik bisa baca kategori aktif"
  on public.menu_categories for select
  to anon, authenticated
  using (true);

create policy "Admin bisa insert kategori"
  on public.menu_categories for insert
  to authenticated
  with check (true);

create policy "Admin bisa update kategori"
  on public.menu_categories for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin bisa delete kategori"
  on public.menu_categories for delete
  to authenticated
  using (true);

-- Menu Items
alter table public.menu_items enable row level security;

create policy "Publik bisa baca menu aktif"
  on public.menu_items for select
  to anon, authenticated
  using (true);

create policy "Admin bisa insert menu"
  on public.menu_items for insert
  to authenticated
  with check (true);

create policy "Admin bisa update menu"
  on public.menu_items for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin bisa delete menu"
  on public.menu_items for delete
  to authenticated
  using (true);

-- ===== STORAGE BUCKET =====
-- Bucket untuk foto menu, logo, hero image
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Foto bisa dibaca publik"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'images');

create policy "Admin bisa upload foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

create policy "Admin bisa update foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'images');

create policy "Admin bisa hapus foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images');

-- ===== AUTO-UPDATE updated_at =====
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_restaurants_updated_at
  before update on public.restaurants
  for each row execute function public.handle_updated_at();

create trigger set_menu_categories_updated_at
  before update on public.menu_categories
  for each row execute function public.handle_updated_at();

create trigger set_menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.handle_updated_at();
