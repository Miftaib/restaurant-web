# Rencana Implementasi: Website Profile Restoran & Menu Digital

Dokumen ini adalah acuan tahapan pengerjaan bertahap sesuai **PRD.md** (v0.1) dan **Design.md** (Design Brief "Menu Kertas").

---

## Ringkasan Arsitektur & Teknologi

- **Framework**: Next.js 16 (App Router, Server & Client Components, Turbopack)
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS v4 dengan Design Tokens custom (konsep visual "Menu Kertas")
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Supabase Auth, Supabase Storage)
- **Font**: Fraunces 600 (serif hangat display) & Atkinson Hyperlegible (isi & UI) via `next/font/google`
- **Linting & Kode**: ESLint 9 + TypeScript strict mode

---

## Roadmap Fase Pengerjaan

### Fase 0: Setup & Fondasi Proyek (Status: Selesai ✅)
Tujuan: Membangun fondasi arsitektur, basis kode, design system token, library komponen UI dasar, skema database, dan autentikasi proxy.

- [x] Inisialisasi proyek Next.js 16 App Router dengan TypeScript dan Tailwind CSS v4.
- [x] Konfigurasi design tokens di `app/globals.css` (`--paper`, `--surface`, `--ink`, `--brand`, `--wa`, dll.).
- [x] Setup tipografi di `app/layout.tsx` (Fraunces & Atkinson Hyperlegible).
- [x] Pembuatan komponen UI dasar sesuai `Design.md`:
  - `Button` (varian primer, sekunder, ghost, wa, danger)
  - `TextField` (label selalu terlihat, accessible error & hint)
  - `Dialog` (accessible modal konfirmasi dengan backdrop)
  - `Switch` (toggle 48x28px untuk status ketersediaan)
  - `Toast` (notifikasi otomatis dismiss / error persisten)
  - `Skeleton` (placeholder pemuatan tanpa pergeseran layout)
  - `Banner` (peringatan status / offline)
- [x] Setup client Supabase (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`).
- [x] Migrasi session proxy (`proxy.ts` sesuai standar Next.js 16).
- [x] Skema database Supabase (`001_initial_schema.sql`) dengan RLS lengkap dan trigger `updated_at`.
- [x] Setup bucket storage `images` publik untuk foto menu/restoran.
- [x] Data seed development (`002_seed_data.sql`) dengan format UUID valid.
- [x] Types TypeScript (`lib/types.ts`) & utilitas format (`lib/format.ts`, `lib/constants.ts`).
- [x] Halaman placeholder publik (`app/page.tsx`) dan 404 (`app/not-found.tsx`).
- [x] Template konfigurasi `.env.local.example` dan `.env.local`.

---

### Fase 1: Halaman Publik & Menu Digital (Status: Selesai ✅)
Tujuan: Membangun pengalaman pengguna pengunjung restoran di layar HP (FR-1, FR-2, FR-3, FR-4).

- [x] Header & Hero Profil: Logo / Monogram, Nama Restoran, Tagline, dan tombol aksi berdampingan.
- [x] Bagian Lokasi & Kontak: Alamat lengkap, tombol "Buka di Google Maps" (tautan langsung), dan nomor telepon.
- [x] Sticky Category Navigation: Tab horizontal kategori dengan sorotan aktif dan auto-centering scroll-spy.
- [x] Daftar Menu per Kategori:
  - Kartu baris menu dengan garis titik pemisah nota (`dotted-divider`).
  - Nama menu, harga tabular Rupiah (Rp 0 = "Gratis").
  - Deskripsi ringkas (maks 2 baris).
  - Foto menu dengan aspek rasio tetap / monogram inisial fallback jika tanpa foto.
  - Penanda jelas jika menu "Habis" (chip `--habis-bg` & ikon status).
- [x] Floating WhatsApp Bar: Tombol hijau WhatsApp menempel di bawah dengan tautan `wa.me` dan pesan template (desktop terintegrasi di top bar).
- [x] Footer Editorial: Tanggal pembaruan terakhir menu & tautan Instagram / Admin.
- [x] SSR / Server Component data fetching dengan fallback cache / default data aman saat Supabase belum terhubung.

---

### Fase 2: Autentikasi & Portal Admin (Status: Selesai ✅)
Tujuan: Membangun gerbang login dan tata letak dasbor admin yang aman (FR-5).

- [x] Halaman login `/admin/masuk`:
  - Form email & kata sandi dengan validasi ramah pengguna.
  - Penanganan error login yang jelas (pesan netral, penanganan rate limit, koneksi).
- [x] Halaman lupa sandi `/admin/lupa-sandi`: Permintaan tautan reset password via Supabase Auth email dengan pesan sukses netral.
- [x] Proteksi Rute Admin di Server & Proxy (`proxy.ts`): Redirect pengunjung tanpa sesi login ke `/admin/masuk`.
- [x] Shell / Layout Admin: Navigasi admin responsif (tab bar bawah 56px di mobile, sidebar 220px di desktop) dengan 3 tujuan utama (Menu, Kategori, Profil Restoran), tautan "Lihat situs", dan tombol Keluar (Logout).

---

### Fase 3: Manajemen Menu & Stok (Owner) (Status: Selesai ✅)
Tujuan: Memberikan kendali penuh kepada owner untuk mengelola menu dan stok dengan nol istilah teknis (FR-6, FR-7).

- [x] Daftar Menu Admin:
  - Tampilan daftar menu per kategori dengan aksi cepat.
  - **1-Tap Stock Toggle**: Mengubah status "Tersedia / Habis" secara instan dengan feedback toast cepat & opsi Undo.
- [x] Form Tambah & Ubah Menu (`/admin/menu/baru`, `/admin/menu/[id]`):
  - Field: Nama, Kategori (dropdown), Harga (input numerik), Deskripsi, Status Aktif (tampil/sembunyikan).
  - Upload Foto Menu: Kompresi gambar di sisi browser (maks 1600px sisi terpanjang, < 5MB) sebelum upload ke Supabase Storage `images`.
- [x] CRUD Kategori Menu (`/admin/kategori`):
  - Tambah kategori baru, edit nama, atur urutan (`sort_order`).
  - Proteksi hapus kategori: blokir penghapusan jika kategori masih memiliki menu (dengan opsi nonaktifkan kategori).
- [x] Dialog konfirmasi sebelum aksi penghapusan menu/kategori.

---

### Fase 4: Manajemen Profil Restoran & Polish Akhir (Status: Selesai ✅)
Tujuan: Pengelolaan profil restoran, audit performa, aksesibilitas, dan uji coba alur owner (FR-8, NFR-1–5, M1–M5).

- [x] Form Edit Profil Restoran (`/admin/profil`):
  - Nama restoran, tagline, deskripsi "Tentang Kami".
  - Alamat lengkap, nomor kontak, nomor WhatsApp (validasi format 628xxx), dan template pesan default.
  - Tautan Google Maps dan Instagram.
  - Upload logo & hero image ke storage.
- [x] Penanganan Edge Cases & Failure States:
  - Error banner jika database tidak terjangkau.
  - State kosong jika belum ada menu ("Menu segera hadir").
  - Long text handling (nama menu / deskripsi panjang tidak merusak tata letak).
- [x] Audit Aksesibilitas & Performa:
  - Skip link ("Lewati ke menu").
  - Target sentuh mobile ≥ 44–48 px.
  - Verifikasi kontras warna WCAG AA.
  - Lighthouse mobile test.
