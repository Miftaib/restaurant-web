// ========================================
// Format utilities
// ========================================

/**
 * Format angka ke Rupiah: 25000 → "Rp 25.000"
 * Harga 0 → "Gratis" (Design.md OQ-6)
 */
export function formatRupiah(amount: number): string {
  if (amount === 0) return "Gratis";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/**
 * Format nomor WhatsApp ke link wa.me
 * Input: "6281234567890" → "https://wa.me/6281234567890"
 */
export function whatsappUrl(
  number: string,
  message?: string | null
): string {
  const base = `https://wa.me/${number}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

/**
 * Format tanggal update: "23 Nov 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format waktu update: "14.20"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
