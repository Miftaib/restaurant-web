// ========================================
// Konstanta aplikasi
// ========================================

/** Batas ukuran upload foto (5 MB) — Design.md OQ-10 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** Sisi terpanjang foto setelah kompres — Design.md OQ-10 */
export const MAX_IMAGE_DIMENSION = 1600;

/** Format file yang diterima — PRD FR-6.3 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Batas karakter deskripsi menu — Design.md A4 */
export const MAX_MENU_DESCRIPTION = 160;

/** Batas karakter Tentang Kami — Design.md P1 §5 */
export const MAX_ABOUT_LENGTH = 600;

/** Durasi toast sukses (ms) — Design.md §7 */
export const TOAST_DURATION_SUCCESS = 8000;

/** Durasi toast error — tidak hilang otomatis */
export const TOAST_DURATION_ERROR = 0;

/** Placeholder teks */
export const PLACEHOLDER = {
  MENU_COMING_SOON: "Menu segera hadir. Sementara itu, tanya langsung lewat WhatsApp.",
  EMPTY_MENU: "Belum ada menu.",
  EMPTY_CATEGORY: "Belum ada kategori. Buat satu, misalnya 'Kopi' atau 'Makanan'.",
  LOAD_ERROR: "Menu belum bisa dimuat. Periksa koneksi, lalu coba lagi.",
  NOT_FOUND: "Halaman tidak ditemukan",
} as const;
