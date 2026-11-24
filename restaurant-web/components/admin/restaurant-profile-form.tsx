"use client";

import { useState, useRef } from "react";
import { type Restaurant } from "@/lib/types";
import { updateRestaurantAction, uploadRestaurantAssetAction } from "@/actions/restaurant";
import { compressImageClient } from "@/lib/image";
import { whatsappUrl } from "@/lib/format";
import { MAX_ABOUT_LENGTH } from "@/lib/constants";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface RestaurantProfileFormProps {
  initialRestaurant: Restaurant;
}

/**
 * A6: Form Profil Restoran — Design.md §6 A6, §7
 * Bagian bertajuk: Identitas · Tentang Kami · Kontak · WhatsApp · Lokasi · Instagram.
 * Termasuk pratinjau chat WhatsApp, tombol coba link, dan optimasi foto browser.
 */
export function RestaurantProfileForm({ initialRestaurant }: RestaurantProfileFormProps) {
  const { addToast } = useToast();

  // Field states
  const [name, setName] = useState(initialRestaurant.name);
  const [tagline, setTagline] = useState(initialRestaurant.tagline || "");
  const [about, setAbout] = useState(initialRestaurant.about || "");
  const [address, setAddress] = useState(initialRestaurant.address);
  const [contactPhone, setContactPhone] = useState(initialRestaurant.contact_phone || "");

  // Format WhatsApp: simpan angka setelah 62 untuk input
  const initialWaInput = initialRestaurant.whatsapp_number
    ? initialRestaurant.whatsapp_number.replace(/^62/, "").replace(/^0/, "")
    : "";
  const [waInput, setWaInput] = useState(initialWaInput);
  const [waMessage, setWaMessage] = useState(
    initialRestaurant.whatsapp_default_message || "Halo, saya ingin bertanya tentang menu."
  );

  const [mapsUrl, setMapsUrl] = useState(initialRestaurant.maps_url || "");
  const [instagram, setInstagram] = useState(initialRestaurant.instagram || "");
  const [logoUrl, setLogoUrl] = useState<string | null>(initialRestaurant.logo_url);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(
    initialRestaurant.hero_image_url
  );

  // Uploading & submitting states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // Hitung tautan WhatsApp langsung untuk tombol uji coba
  const testWaNumber = waInput ? `62${waInput.replace(/[^0-9]/g, "")}` : null;
  const testWaUrl = testWaNumber ? whatsappUrl(testWaNumber, waMessage) : null;

  // Handler Upload Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const compressed = await compressImageClient(file);
      const formData = new FormData();
      formData.append("file", compressed);

      const res = await uploadRestaurantAssetAction(formData);
      if (res.success && res.url) {
        setLogoUrl(res.url);
        addToast({ type: "success", message: "Logo berhasil diperbarui." });
      } else {
        addToast({ type: "error", message: res.error || "Gagal mengunggah logo." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses logo.";
      addToast({ type: "error", message: msg });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Handler Upload Foto Utama / Hero
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHero(true);
    try {
      const compressed = await compressImageClient(file);
      const formData = new FormData();
      formData.append("file", compressed);

      const res = await uploadRestaurantAssetAction(formData);
      if (res.success && res.url) {
        setHeroImageUrl(res.url);
        addToast({ type: "success", message: "Foto utama berhasil diperbarui." });
      } else {
        addToast({ type: "error", message: res.error || "Gagal mengunggah foto utama." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses foto utama.";
      addToast({ type: "error", message: msg });
    } finally {
      setIsUploadingHero(false);
    }
  };

  // Handler Simpan Profil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama kedai wajib diisi.");
      return;
    }

    if (!address.trim()) {
      setErrorMsg("Alamat lengkap wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", initialRestaurant.id);
      formData.append("name", name.trim());
      formData.append("tagline", tagline.trim());
      formData.append("about", about.trim());
      formData.append("address", address.trim());
      formData.append("contact_phone", contactPhone.trim());
      formData.append("whatsapp_number", waInput.trim());
      formData.append("whatsapp_default_message", waMessage.trim());
      formData.append("maps_url", mapsUrl.trim());
      if (logoUrl) formData.append("logo_url", logoUrl);
      if (heroImageUrl) formData.append("hero_image_url", heroImageUrl);
      formData.append("instagram", instagram.trim());

      const res = await updateRestaurantAction(formData);
      if (res.success) {
        addToast({
          type: "success",
          message: "Profil kedai berhasil disimpan.",
        });
      } else {
        setErrorMsg(res.error || "Gagal menyimpan perubahan profil.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi saat menyimpan profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Profil Kedai & Kontak
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Ubah identitas, cerita kedai, kontak pemesanan, dan lokasi Google Maps.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-md border border-line-strong text-ink text-xs font-semibold hover:bg-sunken transition-colors self-start sm:self-auto"
        >
          <span>Lihat di Situs</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Alert Error */}
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-md bg-danger/10 border border-danger/20 text-danger text-xs font-semibold leading-relaxed"
        >
          {errorMsg}
        </div>
      )}

      {/* Form Utama Profil */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================
            BAGIAN 1: IDENTITAS
            ======================================================== */}
        <section className="bg-surface rounded-lg border border-line p-5 sm:p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2">
            1. Identitas Restoran
          </h2>

          {/* Nama Restoran (Wajib) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-name" className="text-sm font-semibold text-ink">
              Nama Restoran / Kedai <span className="text-danger">*</span>
            </label>
            <input
              id="res-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mis. Kedai Nusantara"
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
          </div>

          {/* Tagline */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-tagline" className="text-sm font-semibold text-ink">
              Tagline / Slogan Singkat
            </label>
            <input
              id="res-tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="mis. Cita rasa rumahan, harga bersahabat"
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
          </div>

          {/* Logo & Foto Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-line/60">
            {/* Logo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink block">
                Logo Restoran <span className="text-xs font-normal text-ink-muted">(Kotak 1:1)</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-md bg-sunken border border-line overflow-hidden flex items-center justify-center shrink-0">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display font-semibold text-2xl text-brand">
                      {name ? name.charAt(0).toUpperCase() : "R"}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="sekunder"
                      size="md"
                      loading={isUploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                      className="text-xs h-9 px-3"
                    >
                      {logoUrl ? "Ganti Logo" : "Unggah Logo"}
                    </Button>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl(null)}
                        className="text-xs text-danger hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-ink-muted block">Maks 5 MB</span>
                </div>
              </div>
            </div>

            {/* Foto Utama / Hero Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink block">
                Foto Utama Restoran <span className="text-xs font-normal text-ink-muted">(Rasio 16:9)</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="w-24 h-16 rounded-md bg-sunken border border-line overflow-hidden flex items-center justify-center shrink-0">
                  {heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroImageUrl} alt="Foto Utama" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-ink-muted/60 text-center px-1 font-semibold">
                      Tanpa Foto
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleHeroUpload}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="sekunder"
                      size="md"
                      loading={isUploadingHero}
                      onClick={() => heroInputRef.current?.click()}
                      className="text-xs h-9 px-3"
                    >
                      {heroImageUrl ? "Ganti Foto" : "Unggah Foto"}
                    </Button>
                    {heroImageUrl && (
                      <button
                        type="button"
                        onClick={() => setHeroImageUrl(null)}
                        className="text-xs text-danger hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-ink-muted block">Maks 5 MB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BAGIAN 2: TENTANG KAMI
            ======================================================== */}
        <section className="bg-surface rounded-lg border border-line p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-lg font-bold text-ink">
              2. Tentang Kami
            </h2>
            <span
              className={`text-xs ${
                about.length > MAX_ABOUT_LENGTH ? "text-danger font-bold" : "text-ink-muted"
              }`}
            >
              {about.length}/{MAX_ABOUT_LENGTH}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-about" className="text-xs text-ink-muted leading-relaxed">
              Tuliskan kisah singkat kedai Anda, tahun berdiri, keistimewaan bumbu/bahan masakan, atau suasana tempat.
            </label>
            <textarea
              id="res-about"
              rows={4}
              maxLength={MAX_ABOUT_LENGTH}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Ceritakan latar belakang kedai Anda..."
              className="p-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </section>

        {/* ========================================================
            BAGIAN 3: KONTAK & ALAMAT
            ======================================================== */}
        <section className="bg-surface rounded-lg border border-line p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2">
            3. Alamat & Kontak
          </h2>

          {/* Alamat Lengkap (Wajib) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-address" className="text-sm font-semibold text-ink">
              Alamat Lengkap <span className="text-danger">*</span>
            </label>
            <textarea
              id="res-address"
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Merdeka No. 42, Kelurahan Sukamaju, Kecamatan Cilandak..."
              className="p-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none resize-none"
            />
            <span className="text-xs text-ink-muted">
              Alamat ini akan ditampilkan secara utuh di halaman utama agar pengunjung mudah menemukan kedai.
            </span>
          </div>

          {/* Nomor Telepon Biasa */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-phone" className="text-sm font-semibold text-ink">
              Nomor Telepon / Hotline
            </label>
            <input
              id="res-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="02112345678 atau 081234567890"
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
          </div>
        </section>

        {/* ========================================================
            BAGIAN 4: WHATSAPP (Design.md §6 A6)
            ======================================================== */}
        <section className="bg-surface rounded-lg border border-line p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-lg font-bold text-ink">
              4. Pemesanan via WhatsApp
            </h2>
            <span className="text-xs font-semibold text-wa inline-flex items-center gap-1">
              Tombol Utama Pengunjung
            </span>
          </div>

          {/* Nomor WhatsApp dengan awalan tetap +62 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-wa" className="text-sm font-semibold text-ink">
              Nomor WhatsApp
            </label>
            <div className="flex items-center">
              <span className="h-11 px-3.5 bg-sunken border border-r-0 border-line-strong rounded-l-md text-ink font-semibold text-sm flex items-center select-none">
                +62
              </span>
              <input
                id="res-wa"
                type="tel"
                inputMode="numeric"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="81234567890"
                className="h-11 w-full px-3 border border-line-strong rounded-r-md bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
              />
            </div>
            <span className="text-xs text-ink-muted">
              Tulis tanpa angka 0 di depan, misalnya <strong>81234567890</strong>.
            </span>
          </div>

          {/* Pesan Template Awal */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-wa-msg" className="text-sm font-semibold text-ink">
              Pesan Awal Otomatis
            </label>
            <textarea
              id="res-wa-msg"
              rows={2}
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              placeholder="Halo, saya ingin bertanya tentang menu Kedai Nusantara..."
              className="p-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none resize-none"
            />
          </div>

          {/* Pratinjau Gelembung Chat & Tombol Uji Coba */}
          <div className="p-4 rounded-md bg-sunken/60 border border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Pratinjau Gelembung Chat Pengunjung
              </span>

              {testWaUrl && (
                <a
                  href={testWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-wa hover:underline inline-flex items-center gap-1"
                >
                  <span>Coba di WhatsApp</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>

            {/* Chat Bubble Style */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-wa-tint/20 bg-emerald-50 border border-emerald-200 text-ink rounded-lg p-3 text-xs leading-relaxed shadow-2xs">
                <p className="whitespace-pre-line">
                  {waMessage || "(Pesan kosong)"}
                </p>
                <div className="text-[10px] text-ink-muted/70 text-right mt-1 select-none">
                  14:30 ✓✓
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BAGIAN 5: LOKASI GOOGLE MAPS & INSTAGRAM
            ======================================================== */}
        <section className="bg-surface rounded-lg border border-line p-5 sm:p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2">
            5. Tautan Lokasi & Media Sosial
          </h2>

          {/* Tautan Google Maps */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="res-maps" className="text-sm font-semibold text-ink">
                Tautan Google Maps
              </label>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                >
                  <span>Coba tautan peta</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
            <input
              id="res-maps"
              type="url"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
            />
            <span className="text-xs text-ink-muted">
              Buka Google Maps di HP/laptop, cari kedai Anda, lalu salin tautan bagikan (Share Link).
            </span>
          </div>

          {/* Username Instagram */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="res-ig" className="text-sm font-semibold text-ink">
              Akun Instagram
            </label>
            <div className="flex items-center">
              <span className="h-11 px-3.5 bg-sunken border border-r-0 border-line-strong rounded-l-md text-ink font-semibold text-sm flex items-center select-none">
                @
              </span>
              <input
                id="res-ig"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
                placeholder="kedainusantara"
                className="h-11 w-full px-3 border border-line-strong rounded-r-md bg-surface text-ink text-sm focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            BAR SIMPAN PERUBAHAN
            ======================================================== */}
        <div className="sticky bottom-16 md:bottom-4 z-20 bg-surface/95 backdrop-blur-md border border-line shadow-[var(--e2)] p-4 rounded-lg flex items-center justify-between gap-4">
          <span className="text-xs text-ink-muted hidden sm:inline">
            Perubahan akan langsung terlihat di situs publik dalam beberapa detik.
          </span>

          <Button
            type="submit"
            variant="primer"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting || isUploadingLogo || isUploadingHero}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Menyimpan Profil..." : "Simpan Perubahan Profil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
