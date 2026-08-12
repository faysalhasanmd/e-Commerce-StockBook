"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const { user } = useAuthStore();
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  const quickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || outOfStock || status !== "idle") return;
    setStatus("loading");
    try {
      await api.post("/cart-items", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      });
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-panel border border-line rounded-xl overflow-hidden hover:border-brass/50 hover:shadow-lg transition-all"
    >
      {/* Image / fallback area */}
      <div className="relative aspect-[4/3] bg-line/30 flex items-center justify-center overflow-hidden">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package size={36} className="text-muted/50" />
        )}

        <span className="absolute top-3 left-3 bg-ink/90 backdrop-blur-sm text-muted text-[11px] font-mono px-2 py-1 rounded-full border border-line">
          No. {String(index + 1).padStart(3, "0")}
        </span>

        {product.category && (
          <span className="absolute top-3 right-3 bg-brass/90 text-ink text-[11px] font-medium px-2.5 py-1 rounded-full">
            {product.category.name}
          </span>
        )}

        {/* Quick add — appears on hover */}
        {user && (
          <button
            onClick={quickAdd}
            disabled={outOfStock || status !== "idle"}
            className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all
              ${status === "added" ? "bg-teal text-white" : "bg-ink text-paper hover:bg-brass hover:text-ink"}
              ${outOfStock ? "opacity-40 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"}
            `}
            aria-label="Quick add to cart"
          >
            {status === "added" ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg text-paper mb-1 line-clamp-1 group-hover:text-brass transition-colors">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-muted text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-line">
          <span className="font-mono text-paper text-lg font-medium">
            ${product.price.toFixed(2)}
          </span>

          <span
            className={`text-[11px] font-mono px-2 py-1 rounded-full ${
              outOfStock
                ? "bg-rust/10 text-rust"
                : lowStock
                  ? "bg-brass/10 text-brass"
                  : "bg-teal/10 text-teal"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : lowStock
                ? `Only ${product.stock} left`
                : "In stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
