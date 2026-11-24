# Design Brief — Website Profil Restoran & Menu Digital

Berdasarkan PRD v0.1 · 23 November 2026 · Status: draft untuk review desain, belum ada kode

## 0. Posisi desain dan keputusan atas Open Questions

Produk ini sebenarnya dua antarmuka untuk dua jenis pengguna. **Situs publik** dibaca sekilas di HP, sering di bawah matahari dan dengan sinyal jelek. **Admin** dipakai berulang oleh pemilik yang tidak teknis, sering sambil berdiri di dapur atau kasir. Keduanya memakai satu sistem token, tetapi nadanya berbeda: publik hangat dan editorial, admin tenang dan fungsional.

Beberapa Open Questions di PRD langsung menentukan UI. Daripada menunggu, brief ini mengambil keputusan di bawah. Semuanya bisa dibalik, tetapi seluruh desain berikutnya dibangun di atasnya.

| OQ | Keputusan desain | Alasan |
| --- | --- | --- |
| OQ-1 | UI dibuat theme-able lewat satu variabel `--brand`, tanpa elemen multi-tenant di antarmuka. | Murah sekarang, tidak mengunci jika nanti jadi template untuk banyak klien. |
| OQ-2 | Jam operasional tidak ada di MVP. Slot disiapkan di blok Lokasi dan disembunyikan jika kosong. | Sesuai PRD (v2), tanpa layout yang harus dibongkar nanti. |
| OQ-3 | Satu tombol WhatsApp global (bar menempel di bawah). Tidak ada tombol per item. | Satu tujuan, satu tempat. Tombol per item baru masuk akal bersama pesan otomatis di v2. |
| OQ-4 | Item habis tetap tampil di posisi aslinya, berlabel “Habis”. Tombol WhatsApp tetap aktif. | Pengunjung tetap bisa tanya “kapan ada lagi?”. Posisi tidak melompat saat owner menekan toggle. |
| OQ-5 | Hanya alamat teks + tombol “Buka di Google Maps”. Tanpa embed. Owner menempelkan tautan Maps. | Embed menambah berat halaman dan mengancam target Lighthouse ≥ 80. Tombol langsung membuka aplikasi Maps, yang memang dibutuhkan. |
| OQ-6 | Satu harga bilangan bulat per item. Rp 0 tampil “Gratis”. Tidak ada varian. | Varian masuk v2. Mencegah harga “Rp 0” terlihat seperti bug. |
| OQ-7 | Bahasa Indonesia saja, Rupiah. Teks publik tanpa kata ganti orang. Admin memakai “Anda”. | Menghindari pilihan kamu/Anda yang salah nada untuk kafe maupun rumah makan keluarga. |
| OQ-8 | Diasumsikan email + kata sandi, 1–2 akun. Ada layar “Lupa kata sandi” (tautan reset lewat email). | Owner non-teknis pasti lupa kata sandi. Tanpa layar ini, mereka menelepon developer, yang bertentangan dengan tujuan produk. |
| OQ-10 | Satu foto per item. JPG/PNG/WebP, batas unggah 5 MB, dikompres di browser ke sisi terpanjang 1600 px. | Foto HP owner besar. Kompres di klien menjaga kecepatan dan menghindari error “file terlalu besar”. |
| OQ-11 | Profil: logo + satu foto utama. Tanpa galeri. | Sesuai v2. |
| OQ-14 | Hapus kategori yang masih berisi item diblokir dengan penjelasan dan tawaran “Nonaktifkan kategori”. Edit bersamaan: peringatan konflik berdasarkan waktu ubah. Nama item kembar diperbolehkan. | Aturan paling aman untuk owner non-teknis. Menghapus berantai tidak bisa dibatalkan. |
| OQ-15 | Slot Instagram di footer, disembunyikan jika kosong. | Hampir semua UMKM kuliner punya Instagram. Biayanya satu baris UI. |
| OQ-16 | Dirancang agar perubahan terlihat di publik dalam ≤ 60 detik (revalidasi saat data berubah). Teks admin tidak pernah menjanjikan “langsung”. | Janji yang jujur lebih baik daripada janji instan yang kadang gagal. Butuh dukungan di desain teknis. |

## 1. Design principles

Tiga aturan. Masing-masing punya uji yang bisa dicek saat review desain.

**1. Harga dulu, hiasan belakangan.** Pengunjung datang untuk satu hal: apa yang dijual dan berapa harganya. Nama, harga, dan status item harus terbaca tanpa ketukan, tanpa modal, dan tanpa menunggu foto.

- Uji: di layar 360×640, navigasi kategori dan minimal satu item menu terlihat tanpa scroll.
- Uji: teks dan harga dirender lebih dulu. Foto lazy-load dengan rasio tetap sehingga tidak menggeser layout.
- Uji: halaman tetap tampak sengaja dan rapi tanpa satu pun foto. UMKM sering tidak punya foto bagus, jadi desain text-first dan foto adalah bonus.

**2. Jujur soal ketersediaan.** Masalah inti di PRD adalah pengunjung datang untuk menu yang habis atau harganya berbeda. UI tidak boleh menyembunyikan ketidakpastian.

- Uji: item habis ditandai dengan teks “Habis”, bukan hanya warna pudar.
- Uji: data dari cache atau saat offline selalu memuat waktu pembaruan (“Diperbarui 14.20”).
- Uji: footer publik menampilkan tanggal pembaruan menu terakhir.

**3. Admin: satu ketukan, nol istilah teknis.** Metrik M2 mengukur apakah owner mandiri. Desain admin dinilai dari seberapa cepat Pak Budi menyelesaikan tugas, bukan dari seberapa lengkap fiturnya.

- Uji: tandai habis dan ubah harga selesai dalam ≤ 2 ketukan dari halaman Menu, tanpa membuka form penuh.
- Uji: tidak ada istilah seperti slug, sort\_order, atau soft delete di layar. Pakai “Tersedia/Habis”, “Tampil di situs”, “Urutan”.
- Uji: setiap perubahan punya umpan balik terlihat (toast + baris menyala sebentar), dan aksi yang merusak punya jalan mundur (Urungkan atau konfirmasi).
- Uji: semua target sentuh admin ≥ 48 px.

## 2. Visual direction

**Konsep: “Menu Kertas”.** Situs terasa seperti kartu menu cetak di atas meja kedai: kertas krem tebal, huruf serif hangat, tinta gelap, dan satu warna aksen yang mengingatkan sambal. Bukan aplikasi pesan-antar, karena produk ini memang bukan itu (pemesanan online masuk Non-Goals).

**Mood:** hangat, jujur, rapi, tidak mewah. Seperti kedai yang bersih dan pemiliknya ramah, bukan restoran fine dining.

**Referensi (arah, bukan untuk ditiru):**

- Kartu menu cetak kafe independen dan rumah makan: kertas, serif, hierarki jelas.
- Nota/struk: garis titik pemisah dan angka rata, tabular.
- Papan menu kedai kopi tradisional: nama besar, harga tidak pernah tersembunyi.
- Tata letak editorial majalah makanan: ritme dan ruang napas, tanpa kepadatan kartu e-commerce.

**Elemen khas (agar tidak terasa template):**

- **Garis titik nota** sebagai pemisah antar item menu dan antar bagian. Murah dibuat (`border-bottom: 2px dotted`), langsung dikenali, dan tidak bisa dikira template SaaS.
- **Angka harga tabular** (rata lurus) dalam Rupiah, selalu tampil di baris yang sama untuk semua item.
- **Monogram sebagai pengganti foto:** huruf pertama nama item di kotak krem tua. Item tanpa foto terlihat disengaja, bukan rusak.
- Foto: radius kecil, tanpa bayangan, tanpa overlay gradasi.

**Dihindari, dan alasannya:**

- Palet cokelat kopi gelap + emas. Klise “kafe”, kontras rendah di bawah matahari, dan menyamakan semua klien.
- Hero foto layar penuh dengan teks di atas gradasi. Memakan layar HP, menunda menu, dan bergantung pada foto bagus.
- Glassmorphism, gradasi ungu/biru, kartu dengan bayangan besar. Tampilan default AI/SaaS, tidak ada hubungannya dengan makanan.
- Gaya aplikasi delivery (hijau/merah neon, grid foto besar). Menjanjikan fitur pesan yang tidak ada.
- Emoji sebagai ikon, carousel hero, parallax, pop-up “pasang aplikasi”, menu hamburger untuk situs satu halaman.
- Dark mode di MVP. Dikeluarkan dengan sengaja: konteks pakai adalah kafe terang, dan token semantik sudah menyiapkan pintunya.

## 3. Design tokens

### 3.1 Warna

Prinsip: netral hangat (bukan abu-abu dingin), satu aksen merek yang bisa diganti per klien, satu warna khusus WhatsApp. Rasio kontras dihitung terhadap `--paper` kecuali disebut lain. Nilainya perkiraan hitung manual dan wajib diverifikasi ulang dengan alat kontras saat implementasi.

| Token | Hex | Pakai untuk | Kontras |
| --- | --- | --- | --- |
| `--paper` | #FAF6EE | Latar halaman | — |
| `--surface` | #FFFDF8 | Kartu, input, sheet | — |
| `--sunken` | #F0E9DA | Placeholder foto, skeleton, latar kelompok | — |
| `--line` | #E6DDCB | Pemisah dekoratif | dekoratif |
| `--line-strong` | #8C8271 | Batas input, ikon batas penting | ≈ 3.5:1 |
| `--ink` | #1F1A14 | Teks utama, tombol primer admin | ≈ 16:1 |
| `--ink-muted` | #5E5548 | Deskripsi, bantuan, label sekunder | ≈ 6.8:1 |
| `--brand` | #B5391C (“Sambal”) | Tautan, penanda kategori aktif, aksen | ≈ 5.5:1 |
| `--brand-tint` | #F6E3DC | Latar kategori aktif, sorotan baris | teks brand di atasnya ≈ 4.7:1 |
| `--wa` | #0B7A3E | Hanya tombol WhatsApp | putih di atasnya ≈ 5.4:1 |
| `--habis-bg` / `--habis-ink` | #EADFCB / #4A3F30 | Chip “Habis” | ≈ 7.8:1 |
| `--success` | #1F6B3A | Toast dan status berhasil | ≈ 6:1 |
| `--warning` | #8A5A00 | Peringatan konflik, hampir berakhir | ≈ 5.5:1 |
| `--danger` | #8F1D1D | Hapus, error | ≈ 8.2:1 |
| `--info` | #1F4E79 | Banner offline | ≈ 8:1 |

**Kenapa Sambal (#B5391C):** merah-oranye terakota yang dekat dengan sambal dan bata, hangat dan langsung terasa kuliner Indonesia, serta cukup gelap untuk dipakai sebagai teks tautan (≥ 4.5:1). Aksen hijau atau biru akan terasa seperti perusahaan teknologi. Setiap klien cukup mengganti `--brand` dan `--brand-tint`.

**Kenapa hijau WhatsApp dipisah (#0B7A3E):** pengunjung mengenali hijau sebagai WhatsApp, jadi tombolnya cepat dikenali dan satu ketukan terasa aman. Hijau resmi WhatsApp tidak lolos kontras dengan teks putih, jadi dipakai versi yang lebih gelap. Hijau ini tidak dipakai untuk hal lain.

**Aturan pemakaian:** tombol terisi hanya satu per layar publik (WhatsApp). Admin memakai tombol primer `--ink` agar tidak ikut berubah saat `--brand` klien diganti. Tombol hapus tidak hanya mengandalkan warna: selalu ada ikon, label “Hapus”, dan dialog konfirmasi (merah `--danger` dan `--brand` cukup dekat sehingga hue saja tidak cukup).

```css
:root {
  --paper:#FAF6EE; --surface:#FFFDF8; --sunken:#F0E9DA;
  --line:#E6DDCB; --line-strong:#8C8271;
  --ink:#1F1A14; --ink-muted:#5E5548;
  --brand:#B5391C; --brand-ink:#FFFFFF; --brand-tint:#F6E3DC;
  --wa:#0B7A3E; --wa-ink:#FFFFFF;
  --habis-bg:#EADFCB; --habis-ink:#4A3F30;
  --success:#1F6B3A; --warning:#8A5A00; --danger:#8F1D1D; --info:#1F4E79;
}
```

### 3.2 Tipografi

**Display dan judul: Fraunces (variabel, 600).** Serif lembut dengan bentuk yang terasa dicetak tangan. Hangat tanpa terkesan mewah, cocok untuk nama kedai dan nama kategori. Gratis (OFL), jadi tidak ada biaya lisensi per klien.

**Isi dan UI: Atkinson Hyperlegible Next.** Dirancang agar setiap huruf mudah dibedakan (I/l/1, O/0), untuk pembaca dengan penglihatan terbatas. Cocok untuk pembaca di bawah matahari pada layar HP murah, dan untuk pemilik berusia 40-an yang membaca form di HP. Berbeda dari Inter/Poppins yang sudah serba ada di mana-mana.

**Performa:** self-host lewat `next/font`, subset Latin, `font-display: swap`, hanya muatkan Fraunces 600 dan Atkinson 400/600/700. Target total font ≤ 100 KB. Fallback: `Georgia` untuk serif dan `system-ui` untuk isi. **Verifikasi di awal:** pastikan Atkinson Hyperlegible Next tersedia di `next/font/google` dan mendukung angka tabular. Jika tidak, fallback-nya Atkinson Hyperlegible (generasi pertama) atau Figtree.

| Token | Font / berat | Mobile → Desktop | Dipakai untuk |
| --- | --- | --- | --- |
| `display` | Fraunces 600 | 36/40 → 56/60 | Nama restoran di hero |
| `title` | Fraunces 600 | 28/34 → 36/42 | Judul bagian (Menu, Tentang, Lokasi) |
| `heading` | Fraunces 600 | 22/28 → 24/30 | Nama kategori |
| `item-name` | Atkinson 700 | 17/24 | Nama menu |
| `body` | Atkinson 400 | 16/24 | Paragraf, isi form |
| `body-sm` | Atkinson 400 | 14/20 | Deskripsi menu (maks 2 baris) |
| `price` | Atkinson 600, tabular | 16/24 | Harga |
| `label` | Atkinson 600 | 14/20 | Tombol, label field |
| `caption` | Atkinson 600 | 13/16 | Chip “Habis”, waktu pembaruan |

Aturan: tidak ada teks di bawah 13 px. Teks isi tidak pernah diberi huruf kapital semua. Lebar baca maksimal 65 karakter (`max-width: 65ch`) di bagian Tentang.

### 3.3 Spacing, radius, shadow

**Skala spacing (basis 4):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. Gutter halaman 16 (mobile), 24 (tablet), 32 (desktop). Jarak antar bagian 48 (mobile) dan 80 (desktop). Padding vertikal baris menu 16.

**Radius:**

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `r-sm` | 6 | Chip, badge |
| `r-md` | 10 | Tombol, input, kartu, foto |
| `r-lg` | 16 | Bottom sheet (sudut atas), dialog |
| `r-full` | 999 | Toggle, bar WhatsApp |

Alasan: radius sedang (bukan kotak tajam, bukan pil di mana-mana) menjaga kesan kertas yang dipotong rapi dan membedakan situs dari template yang semua-bulat.

**Shadow:** hangat (diwarnai tinta, bukan hitam).

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `e0` | tanpa bayangan, batas 1px `--line` | Kartu dan baris. Default. |
| `e1` | 0 1px 2px rgb(31 26 20 / .08) | Top bar saat di-scroll |
| `e2` | 0 -4px 16px rgb(31 26 20 / .12) | Bar WhatsApp, bottom sheet |
| `e3` | 0 16px 40px rgb(31 26 20 / .20) | Dialog |

Aturan: kartu dan baris tidak diberi bayangan. Pemisah dibuat oleh garis titik dan batas tipis. Bayangan hanya untuk elemen yang benar-benar melayang di atas konten.

**Motion:** 150 ms `ease-out` untuk perubahan state, 220 ms untuk sheet dan dialog. Semua animasi mati di `prefers-reduced-motion`.

## 4. Screen inventory

| ID | Screen | URL | Tujuan | Fitur PRD |
| --- | --- | --- | --- | --- |
| P1 | Halaman Publik | `/` | Satu halaman: identitas, menu per kategori, tentang, lokasi dan kontak. Tujuan utama: pengunjung tahu menu, harga, dan lokasi, lalu menghubungi lewat WhatsApp. | F1–F4 |
| P2 | Layar Error Publik | (state dari P1) | Menggantikan halaman jika data gagal dimuat dan tidak ada cache. Selalu menawarkan “Coba lagi” dan jalan keluar lewat WhatsApp. | E1 |
| P3 | 404 | `/*` | Mengembalikan pengunjung ke P1. | — |
| A1 | Masuk | `/admin/masuk` | Owner login. | F5 |
| A2 | Lupa Kata Sandi | `/admin/lupa-sandi` | Meminta tautan reset lewat email. | F5 (OQ-8) |
| A3 | Menu (daftar) | `/admin` | Halaman utama admin. Lihat semua menu, tandai Habis/Tersedia, ubah harga cepat, buka form, atur urutan. Ini sengaja menjadi halaman pertama, bukan dashboard, karena inilah tugas yang paling sering. | F6, F7 |
| A4 | Form Menu | `/admin/menu/baru`, `/admin/menu/[id]` | Tambah atau ubah satu menu, termasuk foto. | F6 |
| A5 | Kategori | `/admin/kategori` | Tambah, ubah nama, aktifkan/nonaktifkan, atur urutan kategori. | F6 |
| A6 | Profil Restoran | `/admin/profil` | Ubah identitas, kontak, nomor WhatsApp, tautan Maps. | F8 |
| O1 | Sheet Ubah Harga | overlay di A3 | Ubah harga cepat (2 ketukan). | F6 |
| O2 | Dialog Konfirmasi | overlay | Hapus menu atau kategori, buang perubahan. | FR-6.5 |
| O3 | Dialog Sesi Berakhir | overlay | Masuk ulang tanpa kehilangan isian. | E14 |
| O4 | Sheet Kategori | overlay di A5 | Tambah atau ubah nama kategori. | F6 |

Tidak ada dashboard, halaman statistik, atau halaman pengaturan terpisah. Semuanya di luar MVP.

**Navigasi admin:** tab bawah di mobile (Menu · Kategori · Profil), sidebar kiri di tablet dan desktop. Di header selalu ada tautan “Lihat situs” (membuka tab baru) dan “Keluar”. Hanya tiga tujuan: jumlah yang cukup untuk dipahami tanpa petunjuk.

## 5. User flow

**J1. Pengunjung mencari menu dan menghubungi lewat WhatsApp (G1, G2)**

1. Masuk dari Google Maps, Instagram, atau tautan yang dibagikan, mendarat di P1.
2. Melihat nama, tagline, dan navigasi kategori tanpa scroll.
3. Mengetuk kategori (mis. “Kopi”) dan halaman bergulir ke bagian itu. Navigasi tetap menempel.
4. Membaca nama, harga, deskripsi. Item habis berlabel jelas.
5. Mengetuk bar WhatsApp di bawah (selalu terlihat).
6. WhatsApp terbuka ke nomor restoran dengan pesan awal terisi (FR-3.2). Jika WhatsApp belum terpasang, tab web WhatsApp terbuka (E9).

**J2. Pengunjung mencari lokasi (G1)**

1. Di P1, ketuk “Lokasi” di top bar atau tombol “Buka Maps” di hero.
2. Halaman bergulir ke blok Lokasi dan Kontak (alamat teks terbaca penuh).
3. Ketuk “Buka di Google Maps”. Aplikasi atau tab Maps terbuka ke lokasi yang benar.

**J3. Owner masuk lalu menandai menu habis (F5, F7, M2c)**

1. Buka `/admin`. Tanpa sesi, diarahkan ke A1.
2. Isi email dan kata sandi, ketuk “Masuk”. Mendarat di A3.
3. Temukan item (urut sama dengan situs, bisa difilter per kategori).
4. Ketuk toggle di kanan baris. Toggle berpindah segera, label menjadi “Habis”.
5. Toast “Es Kopi Susu ditandai Habis” dengan tombol “Urungkan” selama 5 detik.
6. Jika gagal tersimpan, toggle kembali ke posisi semula dan toast error “Gagal menyimpan. Coba lagi” (FR-7.3).
7. Untuk menandai tersedia lagi: ketuk toggle yang sama.

**J4. Owner menambah menu baru dengan foto (F6, M2a)**

1. Di A3, ketuk “+ Tambah menu”.
2. Di A4, isi Nama, pilih Kategori, isi Harga (keypad angka, titik ribuan otomatis).
3. Ketuk area foto, pilih dari galeri atau kamera. Pratinjau muncul. Jika foto gagal, menu tetap bisa disimpan tanpa foto (E11).
4. Opsional: isi Deskripsi.
5. Ketuk “Simpan”. Kembali ke A3, baris baru menyala sebentar, toast “Tersimpan. Akan tampil di situs dalam sekitar 1 menit”.

**J5. Owner mengubah harga (F6, M2b)**

1. Di A3, ketuk harga pada baris menu. Sheet O1 terbuka dengan keypad angka, harga lama terisi dan terpilih.
2. Ketik harga baru, ketuk “Simpan”.
3. Sheet menutup, baris menyala sebentar, toast “Harga diperbarui”. Harga di situs ikut berubah.

**J6. Owner mengubah profil dan nomor WhatsApp (F8)**

1. Tab “Profil”, ubah bagian yang perlu. Setiap bagian punya judul sendiri (Identitas, Tentang, Kontak, WhatsApp, Lokasi).
2. Saat mengisi nomor, tersedia pratinjau pesan WhatsApp dan tombol “Coba tautan”.
3. Bar “Simpan perubahan” muncul di bawah begitu ada perubahan. Ketuk. Toast berhasil, tautan “Lihat situs”.

**J7. Owner mengatur urutan (US-10)**

1. Di A3 atau A5, ketuk “Atur urutan”. Baris berubah menampilkan pegangan seret dan tombol “Naikkan”/“Turunkan”.
2. Atur urutan. Ketuk “Selesai”. Urutan tersimpan dan toast muncul.

**J8. Owner menghapus (FR-6.5, E13)**

1. Menu: menu “⋯” pada baris, “Hapus menu”, dialog “Hapus Es Kopi Susu? Tindakan ini tidak bisa dibatalkan. Jika hanya ingin sementara, pakai ‘Habis’.” dengan tombol “Hapus” dan “Batal”.
2. Kategori berisi item: dialog memblokir dengan penjelasan “Kategori ini masih berisi 6 menu” dan tombol “Nonaktifkan kategori” sebagai jalan keluar.

**J9. Lupa kata sandi (OQ-8)**

1. Di A1, ketuk “Lupa kata sandi?”. Isi email di A2.
2. Pesan netral: “Jika email terdaftar, tautan reset sudah dikirim” (tidak membocorkan akun mana yang ada).

## 6. Layout per screen

Ukuran acuan mobile 390 px, dengan batas bawah 360 px. Tablet dan desktop dibahas di bagian 9.

### P1 — Halaman Publik

Urutan dari atas ke bawah. Menu sengaja ditaruh sebelum Tentang Kami: Rina membuka situs untuk melihat menu, bukan membaca sejarah kedai.

1. **Top bar** (56 px, menempel). Kiri: logo atau monogram + nama (nama baru muncul setelah hero tergulir lewat). Kanan: tautan teks “Lokasi”. Bayangan `e1` hanya muncul setelah scroll.
2. **Hero** (kompak, bukan layar penuh). Foto utama 16:9 jika ada, tanpa teks di atas foto. Di bawahnya: nama restoran (`display`), tagline (`body`, `--ink-muted`), dua tombol sekunder berdampingan: “Lihat menu” dan “Buka Maps”. Tanpa foto: blok `--sunken` dengan monogram besar. Hierarki: nama > tagline > aksi. Hero dibatasi agar navigasi kategori dan satu item muncul di layar 360×640 (Prinsip 1).
3. **Navigasi kategori** (48 px, menempel di bawah top bar). Tautan horizontal yang bisa digeser. Aktif: teks `--ink` tebal + garis bawah 3 px `--brand`. Scroll-spy menandai kategori yang sedang dilihat dan menggeser tautan aktif ke tengah. Gradasi tipis di tepi menandakan masih ada tautan lain.
4. **Menu**, per kategori: heading (`heading`) lalu daftar baris. Baris: kolom teks di kiri (nama, deskripsi maks 2 baris, harga), foto 88×88 di kanan. Pemisah garis titik. Item habis: chip “Habis” di samping nama, foto diredupkan, teks tetap penuh kontras. Aturan foto: jika satu pun item dalam kategori punya foto, item tanpa foto memakai tile monogram agar baris tetap sejajar. Jika tidak ada satu pun foto di kategori itu, kolom foto dihilangkan dan teks memakai lebar penuh.
5. **Tentang Kami**: judul (`title`) dan satu paragraf (maks 65ch). Batas 600 karakter di admin agar bagian ini tidak mengalahkan menu.
6. **Lokasi dan Kontak**: kartu `--surface` dengan batas tipis. Isi: alamat (teks, terbaca penuh), tombol “Buka di Google Maps” (sekunder, lebar penuh), nomor telepon (tautan `tel:`), slot jam buka (disembunyikan di MVP), Instagram (jika ada).
7. **Footer**: nama restoran, “Menu diperbarui 23 Nov 2026” (Prinsip 2).
8. **Bar WhatsApp** (menempel di bawah, 56 px, margin 16, `r-full`, `e2`, `--wa`): ikon + “Tanya atau pesan via WhatsApp”. Menghormati safe-area bawah. Konten diberi padding bawah 96 px agar tidak tertutup. Hilang jika nomor belum diisi (FR-3.4).

**Aksi utama:** WhatsApp. **Komponen:** TopBar, Hero, CategoryNav, MenuItemRow, StatusChip, ImageTile, InfoBlock, Button, WhatsAppBar.

### P2 — Layar Error Publik dan P3 — 404

Top bar tetap. Di tengah: judul, satu kalimat penjelasan, satu tombol. P2: “Menu belum bisa dimuat”, tombol primer “Coba lagi”, di bawahnya tautan teks “Atau tanya lewat WhatsApp”. P3: “Halaman tidak ditemukan”, tombol “Ke beranda”.

### A1 — Masuk

Kartu `--surface` di tengah, lebar maks 400. Urutan: nama restoran (teks), judul “Masuk”, Email, Kata sandi (dengan tombol “Tampilkan”), tombol “Masuk” lebar penuh (primer), tautan “Lupa kata sandi?”. Tidak ada pendaftaran. Fokus awal di Email. **Aksi utama:** Masuk.

### A2 — Lupa Kata Sandi

Judul “Atur ulang kata sandi”, satu kalimat penjelasan, Email, tombol “Kirim tautan”, tautan “Kembali ke Masuk”.

### A3 — Menu (daftar)

1. **Header halaman:** judul “Menu”, tautan “Lihat situs” di kanan.
2. **“+ Tambah menu”**: tombol primer, lebar penuh di mobile.
3. **Filter kategori:** baris chip (“Semua” dan satu per kategori) + tombol teks “Atur urutan” di kanan.
4. **Daftar**, dikelompokkan per kategori dengan heading kecil yang menempel. Setiap baris punya dua garis. Garis 1: thumbnail 48, nama menu (1 baris, dipotong), dan **switch stok** di kanan dengan label “Tersedia” atau “Habis” di bawahnya. Garis 2: kategori · harga (harga adalah tombol teks yang membuka O1) dan menu “⋯” (Ubah, Sembunyikan dari situs, Hapus). Mengetuk nama atau foto membuka A4.
5. **Tab bawah.**

**Aksi utama:** toggle stok (tugas paling sering) dan “+ Tambah menu” (tugas paling penting). **Komponen:** AdminShell, FilterChips, AdminMenuRow, StockSwitch, Button, OverflowMenu, Toast.

### A4 — Form Menu

Header: tombol kembali, judul “Tambah menu” atau “Ubah menu”. Urutan bidang: **Nama menu** (wajib), **Kategori** (wajib, default kategori yang terakhir dipakai), **Harga** (wajib, awalan “Rp”), **Foto**, **Deskripsi** (maks 160 karakter, dengan hitungan), **Ketersediaan** (switch, default Tersedia), **Tampil di situs** (switch, default aktif). Bar aksi menempel di bawah: “Simpan” (primer) dan “Batal” (ghost). Di mode ubah, tautan “Hapus menu” (warna `--danger`, dengan ikon) ada di bawah form dengan jarak 48 px dari tombol simpan agar tidak tersentuh tidak sengaja.

Keputusan urutan: bidang wajib dulu, foto di tengah. Foto opsional dan paling lama diisi, sehingga tidak boleh menghalangi tiga bidang yang membuat menu bisa tayang (menekan waktu M2a).

### A5 — Kategori

Tombol “+ Tambah kategori” (primer). Daftar baris: nama, “6 menu”, switch “Tampil di situs”, menu “⋯” (Ubah nama, Hapus). Tambah dan ubah nama lewat sheet O4 yang hanya berisi satu field. Tombol teks “Atur urutan”.

### A6 — Profil Restoran

Satu halaman scroll, dibagi bagian bertajuk: **Identitas** (Nama wajib, Tagline, Logo, Foto utama) · **Tentang Kami** (area teks 600 karakter) · **Kontak** (Alamat wajib, Telepon) · **WhatsApp** (Nomor dengan awalan tetap “+62” dan bantuan “tulis tanpa 0 di depan”, Pesan awal dengan pratinjau gelembung chat, tombol “Coba di WhatsApp”) · **Lokasi** (tautan Google Maps + tombol “Coba tautan”) · **Instagram** (opsional). Bar “Simpan perubahan” muncul menempel di bawah begitu ada perubahan. Nomor disimpan dalam format internasional (FR-3.3) tanpa pemilik perlu tahu istilahnya.

### Overlay

- **O1 Sheet Ubah Harga:** judul nama menu, satu field harga besar dengan keypad angka, harga lama terisi dan terpilih, “Simpan” dan “Batal”.
- **O2 Dialog Konfirmasi:** judul berbentuk pertanyaan, satu kalimat akibatnya, “Batal” dan “Hapus”. Fokus awal di “Batal”.
- **O3 Dialog Sesi Berakhir:** “Sesi berakhir. Masuk lagi untuk menyimpan. Isian Anda masih aman.” Setelah masuk, penyimpanan dilanjutkan (FR-5.3, E14).
- **O4 Sheet Kategori:** satu field nama, “Simpan” dan “Batal”.

## 7. Component library

Semua komponen memakai token di bagian 3. State fokus dan disabled berlaku untuk semua komponen interaktif dan tidak diulang di tabel kecuali ada perilaku khusus.

### Publik

| Komponen | Varian | State | Catatan |
| --- | --- | --- | --- |
| Button | Primer (`--ink`), Sekunder (garis `--ink`), Ghost (teks), WhatsApp (`--wa`), Danger. Ukuran md 44, lg 52. | default, hover, focus-visible, pressed, disabled, loading (spinner, label tetap) | Hanya satu tombol terisi per layar publik. |
| TopBar | Transparan di atas hero, solid saat scroll | default, scrolled | Nama muncul setelah hero lewat. |
| CategoryNav | Horizontal (mobile, tablet), rail vertikal (desktop) | default, aktif, focus, ada konten tergulir di kiri/kanan | Tautan anchor, bukan tab. |
| MenuItemRow | Dengan foto, dengan monogram, tanpa kolom foto | tersedia, habis, loading (skeleton), teks panjang (nama maks 2 baris, deskripsi 2 baris) | Garis titik sebagai pemisah. |
| PriceText | Normal, “Gratis” | — | Format “Rp 25.000”, tabular. |
| StatusChip | “Habis” (ikon + teks) | — | v2: “Terlaris”, “Baru” memakai bentuk yang sama. |
| ImageTile | Foto, monogram | loading (`--sunken`), loaded (fade 150 ms), error (jatuh ke monogram) | Rasio tetap agar tidak menggeser layout. |
| WhatsAppBar | Bar penuh (mobile, tablet), tombol di top bar (desktop) | default, pressed, tersembunyi (nomor kosong) | Tetap aktif saat offline. |
| InfoBlock | Alamat, telepon, jam (v2), Instagram | terisi, kosong (baris disembunyikan) | Ikon + teks, ikon bukan pembawa makna tunggal. |
| Banner | Info (offline), Peringatan | tampil, dapat ditutup | `role=status`. |
| EmptyState, ErrorState, Skeleton | Satu pola dengan judul, penjelasan, aksi | — | Skeleton memakai `--sunken`, tanpa kilau animasi di `prefers-reduced-motion`. |

### Admin

| Komponen | Varian | State | Catatan |
| --- | --- | --- | --- |
| AdminShell | Tab bawah (<768), sidebar (≥768) | item default, aktif, focus | Tiga tujuan saja. |
| AdminMenuRow | Normal, mode urutan | default, menyala 2 dtk setelah diubah, pending, error, disembunyikan (chip “Disembunyikan”) | Seluruh baris bisa dibaca sebagai satu daftar. |
| StockSwitch | Switch 48×28 + label teks “Tersedia/Habis” | on, off, pending (aria-busy), disabled (offline), error (kembali ke semula) | Optimistis dengan rollback (FR-7.3). |
| TextField | Teks, email, sandi (tombol Tampilkan), area teks (hitungan karakter) | default, hover, focus, filled, error, disabled, read-only | Label selalu terlihat di atas field, tidak pernah hanya placeholder. |
| RupiahField | Awalan “Rp” | sama dengan TextField | `inputmode="numeric"`, titik ribuan otomatis, tidak menerima huruf. |
| Select | Native di mobile | sama dengan TextField | Memakai kontrol bawaan OS agar mudah di HP murah. |
| Switch | Bentuk form | on, off, disabled | Dipakai di “Tampil di situs” dan kategori. |
| ImageUploader | Persegi 1:1 | kosong, mengunggah (progres), berhasil (pratinjau, Ganti, Hapus), error (ukuran, format, jaringan) | Foto dikompres di browser. Error tidak menghalangi simpan tanpa foto. |
| BottomSheet / Dialog | Sheet (mobile), dialog tengah (≥768) | tertutup, terbuka, sibuk | Satu komponen dengan dua presentasi. |
| ConfirmDialog | Hapus, Buang perubahan | terbuka, sibuk | Fokus awal di “Batal”. |
| Toast | Sukses, Error (dengan aksi), Info | muncul, ditahan saat hover atau fokus | Sukses 8 dtk dengan “Urungkan”. Error tidak hilang otomatis. |
| ReorderList | Pegangan seret + tombol Naikkan/Turunkan | idle, sedang diseret, baru dipindah | Seret hanyalah tambahan, tombol adalah jalur utama. |
| OverflowMenu (⋯) | — | tertutup, terbuka | Maksimal 3 item. |
| FilterChips | Satu pilihan | default, dipilih |  |
| StickySaveBar | — | tersembunyi, tampil (ada perubahan), menyimpan | Muncul hanya saat form berubah. |

## 8. State per screen

| Screen | Kosong | Memuat | Error | Sukses | Offline |
| --- | --- | --- | --- | --- | --- |
| **P1 Menu** | “Menu segera hadir. Sementara itu, tanya langsung lewat WhatsApp.” Bar WhatsApp tetap ada. | Skeleton 6 baris (teks lebih dulu bila sudah ada). | P2: “Menu belum bisa dimuat. Periksa koneksi, lalu coba lagi.” + Coba lagi. | Tidak ada layar sukses. Keberhasilan = WhatsApp atau Maps terbuka. | Banner: “Tanpa koneksi. Menampilkan menu terakhir (diperbarui 14.20).” Jika belum pernah dimuat, P2 dengan teks “Tidak ada koneksi”. |
| **P1 Lokasi dan profil** | Baris tanpa data (peta, WhatsApp, Instagram, telepon) disembunyikan. Alamat selalu ada karena wajib. | Skeleton blok. | Ikut P2. | — | Teks terbaca dari cache. Tombol Maps dan WhatsApp tetap tampil. |
| **A1 Masuk** | — | Tombol “Masuk…” dengan spinner, field dinonaktifkan. | “Email atau kata sandi salah.” (satu pesan umum, fokus kembali ke Email). “Terlalu banyak percobaan. Coba lagi dalam 5 menit.” “Tidak bisa terhubung. Coba lagi.” | Pindah ke A3. | Banner “Tidak ada koneksi”, tombol Masuk nonaktif. |
| **A3 Menu** | “Belum ada menu.” + “Tambah menu pertama”. Jika kategori juga belum ada: “Buat kategori dulu” menuju A5. | Skeleton 6 baris. | “Menu belum bisa dimuat.” + Coba lagi. | Toast per aksi (“Es Kopi Susu ditandai Habis · Urungkan”, “Harga diperbarui”), baris menyala 2 dtk. | Banner tetap: “Tidak ada koneksi. Perubahan belum bisa disimpan.” Switch dan harga dinonaktifkan dengan penjelasan. Daftar terakhir tetap terbaca. |
| **A4 Form** | Form baru adalah state kosongnya. | Skeleton field (mode ubah). | Error per field (ikon + teks di bawah field) dan ringkasan di atas form. Foto gagal: pesan spesifik, simpan tanpa foto tetap bisa. Konflik: “Menu ini baru saja diubah. Muat ulang untuk melihat versi terbaru?” | Kembali ke A3, toast “Tersimpan. Akan tampil di situs sekitar 1 menit.”, baris menyala. | Simpan dinonaktifkan, isian disimpan sebagai draf lokal dan dipulihkan. |
| **A5 Kategori** | “Belum ada kategori. Buat satu, misalnya ‘Kopi’ atau ‘Makanan’.” | Skeleton 4 baris. | Sama dengan A3. Hapus kategori berisi item: dialog pemblokir dengan tombol “Nonaktifkan kategori”. | Toast. | Sama dengan A3. |
| **A6 Profil** | Pertama kali: banner “Lengkapi nama dan alamat agar situs siap tayang.” | Skeleton field. | Error per field. Nomor WhatsApp: “Tulis tanpa 0 di depan, misalnya 81234567890.” | Toast “Profil disimpan” + tautan “Lihat situs”. | Simpan dinonaktifkan, draf lokal. |

Sesi kedaluwarsa di layar admin mana pun menampilkan O3, bukan lompat ke halaman login.

**Catatan offline publik:** menampilkan menu terakhir saat offline butuh service worker ringan yang menyimpan halaman terakhir (dan waktunya). Jika tidak dibuat, state offline P1 turun menjadi layar bawaan browser. Ini perlu diputuskan bersama desain teknis.

## 9. Responsive behavior

Breakpoint: **mobile** 320–599 (didesain di 360 dan 390), **tablet** 600–1023 (uji di 768), **desktop** ≥ 1024 (uji di 1280). Tidak boleh ada scroll horizontal di 320 px, kecuali navigasi kategori yang memang dirancang bisa digeser. Semua gambar punya `width`, `height`, dan `sizes` agar tidak menggeser layout.

### Publik

| Aspek | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Wadah dan gutter | Penuh, 16 | Penuh, 24 | Maks 1120 di tengah, 32 |
| Hero | 1 kolom, foto 16:9 | 1 kolom, foto 3:2 | 2 kolom: teks di kiri, foto 4:3 di kanan (tinggi maks 480) |
| Ukuran `display` | 36 | 44 | 56 (skala lancar dengan `clamp()`) |
| Navigasi kategori | Tautan horizontal menempel | Sama | Rail vertikal menempel di kiri (200 px) |
| Daftar menu | 1 kolom, foto 88 | 2 kolom mulai 768, foto 88 | Rail + 2 kolom, foto 96 |
| WhatsApp | Bar penuh (margin 16) | Pil di tengah bawah, lebar maks 420 | Tombol di top bar. Tidak ada elemen melayang, karena top bar sudah menempel |
| Lokasi dan Tentang | Bertumpuk | Bertumpuk, kartu lokasi 2 kolom (alamat | kontak) |

### Admin

| Aspek | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Navigasi | Tab bawah 56 px | Sidebar 200 px | Sidebar 220 px |
| Daftar menu | Baris dua garis | Sama, lebih lebar | Tabel: Foto, Nama, Kategori, Harga, Stok (switch), ⋯. Target sentuh switch tetap 48 |
| Form menu | Layar penuh, bar aksi menempel | Kartu di tengah, lebar maks 560 | Drawer kanan 480 px di atas daftar (konteks tidak hilang) |
| Sheet dan dialog | Bottom sheet | Dialog tengah 480 | Dialog tengah 480 |
| Profil dan kategori | 1 kolom | 1 kolom, maks 640 | 1 kolom, maks 640, bar simpan menempel |

Aturan tambahan: tidak ada fungsi yang hanya bisa dicapai lewat hover. HP landscape: tinggi bar WhatsApp turun ke 48. Tata letak tetap utuh di zoom teks 200%.

## 10. Accessibility

Target: WCAG 2.2 AA. Ini bukan tambahan di akhir: sebagian besar sudah tertanam di token dan komponen di atas.

**Kontras** (nilai perkiraan, verifikasi dengan alat saat implementasi):

| Pasangan | Rasio | Syarat |
| --- | --- | --- |
| `--ink` di `--paper` | ≈ 16:1 | 4.5:1 |
| `--ink-muted` di `--paper` | ≈ 6.8:1 | 4.5:1 |
| `--brand` di `--paper` (tautan) | ≈ 5.5:1 | 4.5:1 |
| Putih di `--brand` | ≈ 5.9:1 | 4.5:1 |
| Putih di `--wa` | ≈ 5.4:1 | 4.5:1 |
| `--habis-ink` di `--habis-bg` | ≈ 7.8:1 | 4.5:1 |
| `--danger` di `--paper` | ≈ 8.2:1 | 4.5:1 |
| `--line-strong` (batas input) di `--paper` | ≈ 3.5:1 | 3:1 (non-teks) |

Informasi tidak pernah hanya lewat warna: “Habis” = teks + ikon, error = ikon + teks, kategori aktif = garis bawah + huruf tebal, tautan selalu bergaris bawah.

**Fokus:**

- Cincin fokus 3 px `--ink` dengan jarak 2 px `--paper` (terlihat di latar terang maupun tombol gelap). Memakai `:focus-visible`, outline tidak pernah dimatikan.
- Elemen yang menempel tidak boleh menutupi elemen yang sedang fokus: `scroll-padding-top` 112 px dan `scroll-padding-bottom` 96 px (WCAG 2.4.11).
- **Urutan fokus publik:** tautan lompat “Lewati ke menu” → top bar (logo, Lokasi) → bar WhatsApp → navigasi kategori → konten (baris menu bukan elemen fokus, pembaca layar memakai heading dan daftar) → Tentang → Lokasi (Maps, telepon, Instagram) → footer. Bar WhatsApp ditaruh di DOM tepat setelah top bar (posisinya diatur CSS) supaya pengguna keyboard mencapainya cepat.
- **Urutan fokus admin:** tautan lompat “Lewati ke konten” → header (Lihat situs, Keluar) → navigasi → judul → “Tambah menu” → filter → daftar (per baris: nama sebagai tautan, harga sebagai tombol, switch, ⋯).
- Sheet dan dialog: fokus dikurung di dalamnya, fokus awal di field pertama (atau “Batal” untuk hapus), fokus dikembalikan ke pemicu saat ditutup.

**Keyboard:** Enter atau Space mengubah switch dan tombol. Esc menutup sheet, dialog, dan menu ⋯. Panah atas/bawah di menu ⋯. Enter di field mengirim form (kecuali area teks). Urutan ulang punya tombol Naikkan/Turunkan, tidak hanya seret. Tidak ada pintasan satu huruf. Tidak ada jebakan keyboard.

**Semantik dan ARIA:**

- `lang="id"`. Landmark: `header`, `nav` (dengan `aria-label="Kategori menu"`), `main`, `footer`. Satu `h1` (nama restoran), `h2` untuk bagian dan kategori. Tiap kategori adalah `section` dengan `aria-labelledby`.
- Menu memakai `ul > li`. Urutan baca: nama, harga, status (“Es Kopi Susu, Rp 22.000, Habis”). Chip “Habis” adalah teks sungguhan. Foto bernama (`alt="Es Kopi Susu"`), monogram `aria-hidden`.
- Navigasi kategori adalah tautan anchor dengan `aria-current="true"` pada yang aktif, bukan `role="tab"`, karena seluruh konten ada di satu halaman.
- Tombol WhatsApp adalah tautan `<a href="https://wa.me/…">` dengan teks “Tanya atau pesan via WhatsApp”, `target="_blank"` dan `rel="noopener"`. Tautan Maps ditandai “(membuka tab baru)”.
- Banner offline memakai `role="status"`. Error memakai `role="alert"`.
- Switch stok: `role="switch"`, `aria-checked`, nama aksesibel “Es Kopi Susu: tersedia”. Hasil diumumkan lewat live region (`aria-live="polite"`): “Es Kopi Susu ditandai Habis”. Saat menyimpan: `aria-busy="true"`.
- Form: label selalu terlihat, `aria-required`, `aria-invalid`, pesan error ditautkan lewat `aria-describedby`. Saat submit gagal, fokus pindah ke ringkasan error di atas form (`role="alert"`) yang berisi tautan ke tiap field. Atribut `autocomplete` (`email`, `current-password`).
- Dialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Toast: sukses 8 detik dan tertahan saat hover atau fokus. “Urungkan” dapat dijangkau keyboard. Error tidak hilang otomatis.
- Urutan ulang: setelah Naikkan/Turunkan, umumkan “Es Kopi Susu, posisi 2 dari 8”.
- Unggah foto: `<input type="file" accept="image/jpeg,image/png,image/webp">`, progres `role="progressbar"` dengan nilai.

**Sentuh dan persepsi:** target sentuh ≥ 44 px di publik dan ≥ 48 px di admin dengan jarak antar target ≥ 8 px. Halaman reflow di 320 CSS px dan tetap berfungsi di zoom teks 200%. Orientasi tidak dikunci. Semua animasi mati di `prefers-reduced-motion`.

**Pengujian minimum sebelum tayang:** audit otomatis (axe, Lighthouse Accessibility ≥ 95), jalan keyboard-saja untuk J1, J3, dan J4, TalkBack di Android (perangkat dominan pengguna di Indonesia) pada P1 dan A3, zoom 200%, dan uji kontras di luar ruangan dengan kecerahan layar penuh.

## 11. Risiko, asumsi, dan urutan bangun

- **Font:** pastikan Atkinson Hyperlegible Next tersedia di `next/font` dan punya angka tabular sebelum token tipografi dikunci. Fallback sudah ditentukan di bagian 3.2.
- **Offline publik:** butuh service worker ringan. Jika dilewati, kebutuhan Prinsip 2 tetap terpenuhi untuk state error, tetapi tidak untuk offline.
- **OQ-16:** target ≤ 60 detik butuh revalidasi saat data berubah di sisi teknis. Jika tidak mungkin, ubah teks toast menjadi “Akan tampil dalam beberapa menit”.
- **Persona dan keputusan di bagian 0 belum divalidasi** (OQ-12, OQ-13). Uji prototipe dengan pemilik sungguhan: tugas M2a–c, ukur waktu dan jumlah ketukan, jangan beri petunjuk.
- **Kualitas foto adalah risiko terbesar di luar kendali desain.** Karena itu layout text-first, monogram sebagai pengganti, dan kompres di klien.

**Urutan bangun yang disarankan:** (1) token dan komponen dasar → (2) P1 dengan data dummy → (3) A1 + A3 + switch stok → (4) A4 + unggah foto → (5) A6 + A5 → (6) state, offline, dan audit aksesibilitas. Alasannya: P1 adalah nilai utama pengunjung dan switch stok di A3 adalah nilai utama pemilik, jadi keduanya harus bisa diuji secepat mungkin dengan restoran pertama.
