import { MAX_IMAGE_DIMENSION, MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

/**
 * Utilitas kompresi foto sisi browser — Design.md OQ-10
 * Menyesuaikan dimensi sisi terpanjang maksimal 1600px dan mengonversi ke format WebP/JPEG ringan.
 */
export async function compressImageClient(file: File): Promise<File> {
  // 1. Validasi tipe file
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
  }

  // 2. Validasi batas ukuran awal (5 MB)
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Ukuran file melebihi 5 MB. Pilih file yang lebih kecil.");
  }

  // Jika di lingkungan non-browser (SSR/Node), kembalikan file asli
  if (typeof window === "undefined") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung skala jika sisi terpanjang melebihi 1600px
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
            width = MAX_IMAGE_DIMENSION;
          } else {
            width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
            height = MAX_IMAGE_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP jika didukung, kualitas 0.85
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanFileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/webp",
          0.85
        );
      };

      img.onerror = () => reject(new Error("Gagal membaca file gambar."));
    };

    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
  });
}
