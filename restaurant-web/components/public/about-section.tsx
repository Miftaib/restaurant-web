import { type Restaurant } from "@/lib/types";

interface AboutSectionProps {
  restaurant: Restaurant;
}

/**
 * AboutSection — Design.md §6 P1 (Tentang Kami)
 * Judul Fraunces, paragraf max-read (65ch) editorial.
 */
export function AboutSection({ restaurant }: AboutSectionProps) {
  if (!restaurant.about) return null;

  return (
    <section id="tentang" className="py-10 sm:py-14 border-t border-line" aria-labelledby="tentang-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2
          id="tentang-title"
          className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-4"
        >
          Tentang Kami
        </h2>
        <p className="font-body text-base text-ink leading-relaxed max-read whitespace-pre-line">
          {restaurant.about}
        </p>
      </div>
    </section>
  );
}
