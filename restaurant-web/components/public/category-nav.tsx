"use client";

import { useEffect, useState, useRef } from "react";
import { type MenuByCategory } from "@/lib/types";

interface CategoryNavProps {
  categories: MenuByCategory[];
}

/**
 * CategoryNav — Design.md §6 P1, §7
 * 48 px, sticky di bawah top bar (top-14).
 * Scroll-spy mendeteksi kategori aktif dan menggeser tab ke tengah.
 */
export function CategoryNav({ categories }: CategoryNavProps) {
  const [activeId, setActiveId] = useState<string>(
    categories[0]?.category.id || ""
  );
  const navRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (categories.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Cari entri yang bersilangan paling atas di viewport
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const id = visible[0].target.id.replace("kategori-", "");
        setActiveId(id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0.1,
    });

    categories.forEach(({ category }) => {
      const el = document.getElementById(`kategori-${category.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  // Geser tombol aktif ke tengah navigasi secara mulus
  useEffect(() => {
    if (!activeBtnRef.current || !navRef.current) return;
    const btn = activeBtnRef.current;
    const container = navRef.current;

    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.offsetWidth;

    container.scrollTo({
      left: btnLeft - containerWidth / 2 + btnWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  if (categories.length === 0) return null;

  return (
    <div className="sticky top-14 z-30 w-full bg-paper/95 backdrop-blur-md border-b border-line shadow-xs">
      <div className="max-w-4xl mx-auto relative px-2 sm:px-6">
        {/* Kontainer scroll horizontal */}
        <nav
          ref={navRef}
          aria-label="Kategori menu"
          className="flex items-center overflow-x-auto scrollbar-none py-2 gap-2 scroll-smooth"
        >
          {categories.map(({ category }) => {
            const isActive = activeId === category.id;
            return (
              <a
                key={category.id}
                ref={isActive ? activeBtnRef : null}
                href={`#kategori-${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveId(category.id);
                  const el = document.getElementById(`kategori-${category.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`
                  shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150
                  ${
                    isActive
                      ? "bg-brand text-brand-ink shadow-xs"
                      : "text-ink-muted hover:text-ink hover:bg-sunken"
                  }
                `}
                aria-current={isActive ? "true" : undefined}
              >
                {category.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
