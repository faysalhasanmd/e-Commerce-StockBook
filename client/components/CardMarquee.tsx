"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function CardMarquee({ products }: { products: Product[] }) {
  const [isPaused, setIsPaused] = useState(false);

  if (products.length === 0) return null;

  // Duplicate the list so the scroll loop feels seamless
  const items = [...products, ...products];

  return (
    <div className="mb-20 overflow-hidden">
      <p className="catalog-number mb-2">Featured Entries</p>
      <h2 className="font-display text-3xl text-paper mb-6">
        Fresh off the shelf
      </h2>

      <div className="relative overflow-hidden">
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent z-20" />

        <div
          className="flex gap-4 w-max animate-marquee py-4"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {items.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-64 shrink-0 transition-transform duration-300 ease-out hover:scale-110 hover:z-10 relative"
            >
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
