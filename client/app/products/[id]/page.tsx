"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Package,
} from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse, Product } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useSWR<ApiResponse<Product>>(
    `/products/${id}`,
    fetcher,
  );
  const product = data?.data;

  const adjustQty = (delta: number) => {
    if (!product) return;
    setQuantity((q) => Math.min(Math.max(1, q + delta), product.stock));
  };

  const addToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      await api.post("/cart-items", {
        userId: user.id,
        productId: id,
        quantity,
      });
      await mutate(`/cart-items/user/${user.id}`);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add to cart.");
      setStatus("idle");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="h-4 w-24 bg-line rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-line/40 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-line rounded" />
            <div className="h-4 w-full bg-line rounded" />
            <div className="h-4 w-2/3 bg-line rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Package className="mx-auto text-muted mb-3" size={32} />
        <p className="text-paper font-medium mb-1">Item not found</p>
        <Link href="/products" className="text-brass text-sm hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-muted hover:text-paper text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square bg-line/30 rounded-xl overflow-hidden flex items-center justify-center border border-line">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package size={64} className="text-muted/50" />
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="inline-block bg-brass/10 text-brass text-xs font-medium px-2.5 py-1 rounded-full mb-3">
              {product.category.name}
            </span>
          )}

          <h1 className="font-display text-3xl sm:text-4xl text-paper mb-3">
            {product.title}
          </h1>

          {product.description && (
            <p className="text-muted leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-paper text-3xl font-medium">
              ${product.price.toFixed(2)}
            </span>
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded-full ${
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

          {!outOfStock && (
            <div className="mb-6">
              <label className="block text-xs text-muted mb-2 font-medium">
                Quantity
              </label>
              <div className="inline-flex items-center border border-line rounded-lg overflow-hidden">
                <button
                  onClick={() => adjustQty(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-paper hover:bg-panel transition-colors disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center font-mono text-paper">
                  {quantity}
                </span>
                <button
                  onClick={() => adjustQty(1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-paper hover:bg-panel transition-colors disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={addToCart}
            disabled={outOfStock || status !== "idle"}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              status === "added"
                ? "bg-teal text-white"
                : "bg-brass text-ink hover:opacity-90"
            } disabled:opacity-40`}
          >
            {status === "added" ? (
              <>
                <Check size={17} /> Added to cart
              </>
            ) : (
              <>
                <ShoppingCart size={17} />
                {outOfStock
                  ? "Unavailable"
                  : status === "loading"
                    ? "Adding…"
                    : "Add to cart"}
              </>
            )}
          </button>

          {error && <p className="text-rust text-sm mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}
