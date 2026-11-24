import { getRestaurant } from "@/lib/data";
import { RestaurantProfileForm } from "@/components/admin/restaurant-profile-form";

export const dynamic = "force-dynamic";

/**
 * A6: Halaman Profil Restoran — Design.md §6 A6
 * Mengubah nama, tagline, logo, foto utama, tentang kami, alamat, WhatsApp, dan Maps.
 */
export default async function AdminProfilPage() {
  const restaurant = await getRestaurant();

  return <RestaurantProfileForm initialRestaurant={restaurant} />;
}
