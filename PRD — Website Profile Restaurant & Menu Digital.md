# PRD — Website Profile Restaurant & Menu Digital

**Versi:** 0.1 (draft untuk review) · **Tanggal:** 23 November 2026 · **Stack:** Next.js + Tailwind + Supabase

Catatan: Item bertanda **\[OQ-x\]** adalah pertanyaan terbuka (lihat bagian 10). Item bertanda *usulan* adalah rekomendasi PM yang belum disepakati.

## 1. Problem Statement

**Yang dirugikan**

1. **Calon pelanggan.** Mereka tidak bisa melihat menu dan harga terkini sebelum datang. Informasi tersebar di Instagram, Google Maps, atau menu cetak yang bisa sudah kedaluwarsa. Akibatnya mereka ragu datang, atau datang lalu kecewa karena harga berbeda atau menu habis.
2. **Pemilik restoran/kafe/UMKM kuliner.** Mereka tidak punya satu halaman resmi yang bisa mereka kendalikan sendiri. Mengubah harga atau menandai menu habis berarti mencetak ulang menu atau menunggu developer.

**Mengapa terjadi:** Solusi yang ada terlalu berat (website custom butuh developer, platform delivery mengambil komisi dan tidak dimiliki owner) atau terlalu tidak terstruktur (postingan sosial media).

**Hipotesis yang perlu divalidasi \[OQ-12\]:** besarnya masalah ini belum didukung data. Validasi lewat restoran pertama.

## 2. Target User dan Persona

**Target user**

- **Primer (pengguna produk):** pengunjung/calon pelanggan yang membuka website lewat HP.
- **Sekunder (pengelola konten):** owner atau staf non-teknis di coffee shop, restoran, atau UMKM kuliner.
- **Klien:** pemilik restoran yang memesan website ini. Apakah klien = owner yang mengelola konten sendiri belum pasti \[OQ-1\].

### Persona 1 — Pengunjung: Rina (asumsi)

- 27 tahun, karyawan, mencari tempat makan lewat Google Maps atau Instagram.
- Perangkat: HP, sering dengan koneksi tidak stabil.
- Kebutuhan: lihat menu, harga, dan foto dengan cepat; tahu lokasi; tanya atau pesan lewat WhatsApp.
- Frustrasi: menu berupa foto buram di Instagram, harga tidak jelas, tidak tahu apakah menu masih tersedia.

### Persona 2 — Owner: Pak Budi (asumsi)

- 42 tahun, pemilik kafe kecil, tidak teknis, mengelola sendiri lewat HP atau laptop sederhana.
- Kebutuhan: ubah harga, tambah menu baru, tandai menu habis dalam hitungan menit tanpa menghubungi developer.
- Frustrasi: biaya cetak ulang menu, ketergantungan pada developer untuk perubahan kecil.

Persona di atas adalah asumsi PM, bukan hasil riset. Validasi dengan restoran pertama \[OQ-13\].

## 3. Goals dan Non-Goals

### Goals

- G1. Pengunjung bisa menemukan profil, menu, harga, dan lokasi restoran dalam satu halaman web yang cepat di HP.
- G2. Pengunjung bisa menghubungi restoran lewat WhatsApp dengan satu ketukan.
- G3. Owner bisa menambah, mengubah, menghapus menu, dan menandai stok habis sendiri tanpa developer.
- G4. Satu restoran nyata live dan dipakai publik.

### Non-Goals (MVP)

- Pemesanan di dalam sistem (keranjang, checkout, riwayat pesanan).
- Pembayaran online.
- Reservasi meja.
- Akun pelanggan, login pengunjung, ulasan/rating.
- Manajemen stok kuantitatif (hanya status tersedia/habis).
- Dukungan multi-restoran dalam satu instalasi \[OQ-1\].
- Integrasi kasir atau POS.

## 4. User Stories

### Pengunjung

- US-1. Sebagai pengunjung, saya ingin melihat daftar menu per kategori beserta foto, harga, dan deskripsi, supaya saya bisa memutuskan mau pesan apa sebelum datang.
- US-2. Sebagai pengunjung, saya ingin tahu menu mana yang sedang habis, supaya saya tidak datang untuk menu yang tidak tersedia.
- US-3. Sebagai pengunjung, saya ingin membaca profil restoran (tentang kami, alamat, kontak), supaya saya tahu restoran ini cocok untuk saya.
- US-4. Sebagai pengunjung, saya ingin melihat lokasi di Google Maps, supaya saya bisa menuju ke sana dengan mudah.
- US-5. Sebagai pengunjung, saya ingin menghubungi restoran lewat WhatsApp dengan satu ketukan, supaya saya bisa bertanya atau memesan tanpa menyalin nomor.

### Owner

- US-6. Sebagai owner, saya ingin login ke halaman admin yang aman, supaya hanya saya yang bisa mengubah konten.
- US-7. Sebagai owner, saya ingin menambah, mengubah, dan menghapus kategori dan menu (termasuk foto), supaya menu di website selalu sesuai kenyataan.
- US-8. Sebagai owner, saya ingin menandai menu habis atau tersedia dengan satu tombol, supaya pengunjung tahu ketersediaan terkini.
- US-9. Sebagai owner, saya ingin mengubah profil restoran (tentang kami, alamat, kontak, nomor WhatsApp), supaya informasi selalu benar.
- US-10. Sebagai owner, saya ingin mengatur urutan menu dan kategori, supaya menu andalan tampil di atas.

## 5. Daftar Fitur

Pembagian di luar 4 fitur yang Anda sebutkan adalah *usulan*.

### MVP

| ID | Fitur | Asal |
| --- | --- | --- |
| F1 | Halaman profil restoran | Anda |
| F2 | Menu digital (kategori, foto, harga, deskripsi) | Anda |
| F3 | Tombol pemesanan via WhatsApp | Anda |
| F4 | Integrasi Google Maps | Anda |
| F5 | Autentikasi admin | Usulan (prasyarat definisi selesai) |
| F6 | Admin: kelola kategori dan menu + upload foto | Usulan (prasyarat definisi selesai) |
| F7 | Admin: tombol stok habis/tersedia | Anda (definisi selesai) |
| F8 | Admin: edit profil restoran | Usulan (prasyarat definisi selesai) |

### v2 (usulan)

- Jam operasional dengan status buka/tutup otomatis \[OQ-2\].
- Galeri foto restoran \[OQ-11\].
- Link media sosial \[OQ-15\].
- Badge menu (rekomendasi, terlaris, baru).
- Varian dan opsi harga (ukuran, topping) \[OQ-6\].
- Pencarian dan filter menu.
- SEO lanjutan dan Open Graph preview.
- Analytics dasar \[OQ-12\].
- Multi-bahasa \[OQ-7\].
- Pesan WhatsApp otomatis berisi daftar menu yang dipilih.

### Nanti

- Pemesanan online dengan keranjang.
- Pembayaran online.
- Reservasi meja.
- QR menu per meja.
- Multi-restoran / multi-tenant \[OQ-1\].
- Promo, voucher, program loyalti.

## 6. Functional Requirements (MVP)

### F1. Halaman Profil Restoran

- FR-1.1 Halaman publik menampilkan: nama restoran, tagline, deskripsi "Tentang Kami", alamat, nomor kontak.
- FR-1.2 Logo dan foto utama ditampilkan jika ada; jika tidak ada, tampil placeholder atau disembunyikan tanpa merusak layout.
- FR-1.3 Halaman dapat diakses tanpa login.
- FR-1.4 Konten dirender dari data Supabase; perubahan dari admin muncul di halaman publik tanpa deploy ulang (strategi caching ditentukan saat desain teknis, perubahan harus terlihat maksimal dalam waktu yang ditetapkan \[OQ-16\]).
- Acceptance: semua field di FR-1.1 tampil benar di layar 360 px tanpa scroll horizontal.

### F2. Menu Digital

- FR-2.1 Menu dikelompokkan per kategori, urutan sesuai `sort_order`.
- FR-2.2 Setiap item menampilkan: nama, harga (format Rupiah, mis. "Rp 25.000" \[OQ-7\]), deskripsi, foto.
- FR-2.3 Item tanpa foto tampil dengan placeholder yang konsisten.
- FR-2.4 Item berstatus habis ditampilkan sesuai kebijakan tampilan \[OQ-4\]. Status wajib terlihat jelas.
- FR-2.5 Kategori tanpa item aktif tidak ditampilkan di halaman publik.
- FR-2.6 Navigasi antar kategori tersedia (mis. tab atau anchor) agar pengunjung tidak harus scroll panjang.
- FR-2.7 Foto dimuat lazy dan dioptimasi (ukuran sesuai layar).
- Acceptance: menu dengan 50 item termuat dan terbaca di HP tanpa layout rusak.

### F3. Tombol Pemesanan via WhatsApp

- FR-3.1 Tombol membuka WhatsApp (`wa.me`) ke nomor yang dikonfigurasi di admin.
- FR-3.2 Pesan awal berisi teks tetap yang bisa diubah owner \[OQ-3\].
- FR-3.3 Format nomor disimpan dalam format internasional (mis. 62812...) dan divalidasi di admin.
- FR-3.4 Jika nomor belum diisi, tombol tidak ditampilkan.
- FR-3.5 Posisi tombol (global/floating, per item, atau keduanya) \[OQ-3\].
- Acceptance: klik tombol di HP dengan WhatsApp terpasang membuka chat ke nomor yang benar dengan pesan awal terisi.

### F4. Integrasi Google Maps

- FR-4.1 Halaman profil menampilkan lokasi restoran dan tombol "Buka di Google Maps" yang membuka aplikasi/tab peta.
- FR-4.2 Bentuk integrasi (embed vs hanya link) dan sumber data lokasi (link Maps, koordinat, atau alamat) \[OQ-5\].
- FR-4.3 Jika data lokasi kosong, bagian peta disembunyikan.
- Acceptance: tombol membuka lokasi yang benar.

### F5. Autentikasi Admin

- FR-5.1 Halaman `/admin` dilindungi login; pengunjung tanpa sesi diarahkan ke halaman login.
- FR-5.2 Metode login dan jumlah akun \[OQ-8\].
- FR-5.3 Sesi kedaluwarsa mengarahkan kembali ke login tanpa kehilangan data yang sedang diisi jika memungkinkan.
- FR-5.4 Seluruh operasi tulis dibatasi di level database (Row Level Security Supabase), bukan hanya di UI. Data publik hanya bisa dibaca, tidak diubah.
- Acceptance: request tulis tanpa sesi admin ditolak oleh database.

### F6. Admin: Kelola Kategori dan Menu

- FR-6.1 CRUD kategori: nama, urutan, aktif/nonaktif.
- FR-6.2 CRUD menu: nama (wajib), kategori (wajib), harga (wajib, bilangan bulat ≥ 0), deskripsi (opsional), foto (opsional).
- FR-6.3 Upload foto: format JPG/PNG/WebP; batas ukuran dan kompresi \[OQ-10\].
- FR-6.4 Pengaturan urutan kategori dan item.
- FR-6.5 Hapus item/kategori meminta konfirmasi. Perilaku hapus kategori yang masih berisi item: lihat bagian 8.
- FR-6.6 Form menampilkan pesan error spesifik per field.
- FR-6.7 Admin dapat dipakai di layar HP.
- Acceptance: owner menambah menu baru lengkap dengan foto dan menu tampil di halaman publik.

### F7. Admin: Tombol Stok Habis/Tersedia

- FR-7.1 Setiap item di daftar admin punya toggle tersedia/habis yang bisa diubah dengan satu ketukan, tanpa membuka form edit.
- FR-7.2 Perubahan tersimpan ke database dan tampil di halaman publik (batas latensi \[OQ-16\]).
- FR-7.3 Jika penyimpanan gagal, toggle kembali ke status semula dan menampilkan pesan error.
- FR-7.4 Status default item baru: tersedia.
- Acceptance: owner menandai item habis dan pengunjung melihat status tersebut.

### F8. Admin: Edit Profil Restoran

- FR-8.1 Owner dapat mengubah: nama, tagline, tentang kami, alamat, nomor kontak, nomor WhatsApp, data lokasi, logo, foto utama.
- FR-8.2 Validasi: nama dan alamat wajib; nomor WhatsApp divalidasi formatnya.
- Acceptance: perubahan tersimpan dan tampil di halaman publik.

### Persyaratan non-fungsional

- NFR-1 Mobile-first; layar minimum yang didukung 360 px.
- NFR-2 Halaman publik dirender di server (SSR/ISR) agar cepat dan bisa diindeks mesin pencari.
- NFR-3 Target performa (usulan): Lighthouse mobile Performance ≥ 80 untuk halaman menu.
- NFR-4 Aksesibilitas dasar: kontras teks memadai, alt text pada foto, tombol dapat disentuh.
- NFR-5 Rahasia (service key Supabase) tidak pernah dikirim ke klien.

## 7. Sketsa Data Model

Asumsi: satu restoran per instalasi \[OQ-1\]. Jika multi-restoran, semua tabel perlu `restaurant_id` dan aturan RLS per pemilik.

**restaurants** (satu baris)

- `id`, `name`, `tagline`, `about`, `address`
- `contact_phone`, `whatsapp_number`, `whatsapp_default_message`
- `maps_url` / `latitude` / `longitude` (sesuai \[OQ-5\])
- `logo_url`, `hero_image_url`
- `updated_at`

**menu\_categories**

- `id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`

**menu\_items**

- `id`, `category_id` (FK → menu\_categories)
- `name`, `description`, `price` (integer, Rupiah, tanpa desimal)
- `image_url` (Supabase Storage)
- `is_available` (default true), `is_active` (soft hide)
- `sort_order`, `created_at`, `updated_at`

**Admin:** menggunakan Supabase Auth (`auth.users`); tabel profil admin hanya jika diperlukan \[OQ-8\].

**Aturan akses (RLS):**

- Baca publik: `restaurants`, `menu_categories` aktif, `menu_items` aktif.
- Tulis: hanya pengguna terautentikasi sebagai admin.
- Storage: bucket foto bisa dibaca publik, tulis hanya admin.

## 8. Edge Case dan Failure State

| # | Situasi | Perilaku yang diharapkan |
| --- | --- | --- |
| E1 | Supabase tidak bisa dijangkau saat pengunjung membuka menu | Tampilkan pesan error yang jelas dengan tombol coba lagi; jangan tampilkan halaman kosong tanpa penjelasan. Fallback cache \[OQ-16\]. |
| E2 | Menu belum ada sama sekali (saat awal launch) | Tampilkan state kosong: "Menu segera hadir". |
| E3 | Semua item dalam satu kategori habis | Kategori tetap tampil dengan item berlabel habis (sesuai \[OQ-4\]). |
| E4 | Semua item habis | Menu tetap tampil; tidak ada error. |
| E5 | Item tanpa foto | Placeholder konsisten. |
| E6 | Nama atau deskripsi sangat panjang | Dipotong rapi di kartu; layout tidak pecah. |
| E7 | Harga 0 atau kosong | Harga kosong ditolak di admin. Harga 0 diperbolehkan atau tidak \[OQ-6\]. |
| E8 | Nomor WhatsApp kosong atau format salah | Admin menolak format salah; tombol WA disembunyikan jika kosong. |
| E9 | WhatsApp tidak terpasang di perangkat | Link `wa.me` membuka halaman web WhatsApp; tidak ada penanganan tambahan. |
| E10 | Google Maps gagal dimuat (embed) | Tampilkan alamat teks dan tombol link sebagai fallback. |
| E11 | Upload foto gagal atau melebihi batas | Pesan error spesifik; data menu lain tidak hilang; item bisa disimpan tanpa foto. |
| E12 | Format file bukan gambar | Ditolak dengan pesan jelas. |
| E13 | Hapus kategori yang masih berisi item | Perilaku belum ditetapkan (blokir, hapus berantai, atau pindahkan) \[OQ-14\]. |
| E14 | Sesi admin kedaluwarsa saat mengisi form | Arahkan ke login; usahakan data form tidak hilang. |
| E15 | Dua admin mengedit item yang sama bersamaan | Perilaku belum ditetapkan \[OQ-14\]. |
| E16 | Toggle stok gagal tersimpan (koneksi putus) | Kembalikan ke status semula dan tampilkan error. |
| E17 | Koneksi lambat | Foto lazy-load; teks dan harga tampil lebih dulu. |
| E18 | Akses `/admin` tanpa login | Redirect ke login; tidak ada data admin yang bocor. |
| E19 | Dua item dengan nama sama | Diperbolehkan atau tidak \[OQ-14\]. |

## 9. Success Metrics

Target angka adalah *usulan* dan perlu dikonfirmasi.

### Metrik selesai (dari definisi selesai Anda)

- M1. Satu restoran nyata live atau siap dipakai publik di domain yang bisa diakses.
- M2. Owner menyelesaikan 3 tugas tanpa bantuan developer: (a) menambah menu baru dengan foto, (b) mengubah harga menu, (c) menandai menu habis lalu tersedia kembali. Ukuran: 3 dari 3 tugas selesai dalam sesi uji.

### Metrik kualitas (usulan)

- M3. Lighthouse mobile Performance ≥ 80 pada halaman menu (NFR-3).
- M4. Tidak ada kerusakan layout pada lebar 360 px, 390 px, dan 768 px.
- M5. Tidak ada operasi tulis berhasil tanpa sesi admin (diuji manual).

### Metrik penggunaan (usulan, butuh analytics \[OQ-12\])

- M6. Jumlah kunjungan halaman menu per bulan.
- M7. Jumlah klik tombol WhatsApp per bulan.
- M8. Frekuensi update menu oleh owner per bulan (indikator owner benar-benar mandiri).

## 10. Open Questions

| ID | Pertanyaan | Dampak |
| --- | --- | --- |
| OQ-1 | Satu restoran per instalasi, atau template yang dipakai ulang untuk banyak klien (multi-tenant)? Klien dan pengelola konten orang yang sama? | Skema data, RLS, deployment |
| OQ-2 | Apakah jam operasional wajib di MVP? Tidak disebut dalam scope profil. | Field profil, status buka/tutup |
| OQ-3 | Tombol WhatsApp: satu tombol global/floating, per item, atau keduanya? Isi pesan awal seperti apa? | UI F2/F3 |
| OQ-4 | Item habis: tetap tampil berlabel "Habis" atau disembunyikan? Tombol WA tetap aktif untuk item habis? | Perilaku F2, F7 |
| OQ-5 | Google Maps: embed atau hanya tombol link? Owner memasukkan link Maps, koordinat, atau alamat? Embed tanpa API key cukup? | F4, biaya |
| OQ-6 | Perlu varian harga (ukuran, topping), harga rentang, atau item gratis (Rp 0)? | Skema `menu_items` |
| OQ-7 | Bahasa tunggal (Indonesia) atau multi-bahasa? Mata uang hanya Rupiah? | Teks UI, format harga |
| OQ-8 | Berapa akun admin? Metode login (email+password, magic link)? Siapa yang menangani lupa password? | F5 |
| OQ-9 | Hosting dan domain: platform apa, domain custom atau subdomain, anggaran per bulan? | Deployment |
| OQ-10 | Batas ukuran foto dan jumlah foto per item? Siapa yang menyediakan foto? Apakah foto wajib? | F6, Storage |
| OQ-11 | Berapa foto di halaman profil (logo, hero, galeri)? | F1 |
| OQ-12 | Apakah analytics masuk MVP? Tanpa itu M6–M8 tidak terukur. Apakah masalah di bagian 1 sudah divalidasi dengan data/wawancara? | Metrik |
| OQ-13 | Restoran nyata pertama siapa, jumlah item menu perkiraan, dan tenggat target? | Rencana, uji coba |
| OQ-14 | Aturan hapus kategori berisi item, edit bersamaan, dan nama item kembar. | F6, E13, E15, E19 |
| OQ-15 | Link media sosial (Instagram, dll.) perlu di profil? | F1 |
| OQ-16 | Seberapa cepat perubahan dari admin harus terlihat di publik (instan, atau beberapa menit)? Perlu fallback cache saat database tidak terjangkau? | Strategi rendering dan caching |
