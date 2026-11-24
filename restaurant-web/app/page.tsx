import type { Metadata } from "next";
import { getRestaurant, getMenuCategoriesWithItems } from "@/lib/data";
import { TopBar } from "@/components/public/top-bar";
import { Hero } from "@/components/public/hero";
import { CategoryNav } from "@/components/public/category-nav";
import { MenuItemRow } from "@/components/public/menu-item-row";
import { AboutSection } from "@/components/public/about-section";
import { LocationSection } from "@/components/public/location-section";
import { WhatsAppBar } from "@/components/public/whatsapp-bar";
import { Footer } from "@/components/public/footer";
import { EmptyMenu } from "@/components/public/empty-menu";

// Revalidasi setiap 60 detik (Design.md OQ-16)
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const restaurant = await getRestaurant();
  return {
    title: `${restaurant.name} · Menu Digital & Profil Restoran`,
    description: restaurant.tagline || restaurant.about || "Menu digital dan informasi restoran",
    openGraph: {
      title: restaurant.name,
      description: restaurant.tagline || undefined,
      images: restaurant.hero_image_url ? [restaurant.hero_image_url] : undefined,
    },
  };
}

/**
 * P1: Halaman Publik Utama
 * Server Component — Mobile-first "Menu Kertas".
 * PRD: FR-1, FR-2, FR-3, FR-4.
 */
export default async function HomePage() {
  const [restaurant, menuCategories] = await Promise.all([
    getRestaurant(),
    getMenuCategoriesWithItems(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink pb-24 lg:pb-8">
      {/* Skip link untuk navigasi keyboard & screen reader (Design.md §10) */}
      <a href="#menu" className="skip-link">
        Lewati ke menu
      </a>

      {/* 1. TopBar (56px, sticky) */}
      <TopBar restaurant={restaurant} />

      {/* 2. Bar WhatsApp (Floating di mobile, di DOM urutan awal untuk aksesibilitas) */}
      <WhatsAppBar restaurant={restaurant} />

      {/* 3. Hero Restoran */}
      <main id="main-content" className="flex-1">
        <Hero restaurant={restaurant} />

        {/* 4. Navigasi Kategori (Sticky di bawah topbar) */}
        {menuCategories.length > 0 && (
          <CategoryNav categories={menuCategories} />
        )}

        {/* 5. Daftar Menu per Kategori */}
        <section id="menu" className="max-w-4xl mx-auto px-4 sm:px-6 py-6" aria-label="Daftar Menu Restoran">
          {menuCategories.length === 0 ? (
            <EmptyMenu restaurant={restaurant} />
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {menuCategories.map(({ category, items }) => {
                // Aturan foto Design.md §6 P1:
                // Jika setidaknya 1 item dalam kategori memiliki foto, kolom foto diaktifkan
                // agar tata letak tetap sejajar rapi.
                const hasAnyPhoto = items.some((item) => Boolean(item.image_url));

                return (
                  <section
                    key={category.id}
                    id={`kategori-${category.id}`}
                    className="scroll-mt-32"
                    aria-labelledby={`heading-${category.id}`}
                  >
                    {/* Judul Kategori */}
                    <div className="border-b-2 border-ink pb-2 mb-4">
                      <h2
                        id={`heading-${category.id}`}
                        className="font-display text-xl sm:text-2xl font-semibold text-ink"
                      >
                        {category.name}
                      </h2>
                    </div>

                    {/* Baris-baris Menu */}
                    <div className="divide-y divide-transparent">
                      {items.map((item) => (
                        <MenuItemRow
                          key={item.id}
                          item={item}
                          showPhotoColumn={hasAnyPhoto}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {/* 6. Tentang Kami */}
        <AboutSection restaurant={restaurant} />

        {/* 7. Lokasi dan Kontak */}
        <LocationSection restaurant={restaurant} />
      </main>

      {/* 8. Footer */}
      <Footer restaurant={restaurant} />
    </div>
  );
}
