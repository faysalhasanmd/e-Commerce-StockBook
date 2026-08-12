"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/axios";
import { ApiResponse, Product } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const { data, isLoading } = useSWR<ApiResponse<Product>>(`/products/${id}`, fetcher);
  const product = data?.data;

  const addToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      await api.post("/cart-items", { userId: user.id, productId: id, quantity });
      setMessage("Added to cart.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Could not add to cart.");
    }
  };

  if (isLoading) return <p className="text-muted font-mono">Loading…</p>;
  if (!product) return <p className="text-muted font-mono">Item not found.</p>;

  return (
    <div className="max-w-2xl">
      <p className="catalog-number mb-2">{product.category?.name || "Uncategorized"}</p>
      <h1 className="font-display text-4xl text-paper mb-4">{product.title}</h1>
      <p className="text-muted mb-6">{product.description}</p>

      <div className="bg-panel border hairline rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-brass text-3xl">${product.price.toFixed(2)}</span>
          <span className={`font-mono text-sm ${product.stock > 0 ? "text-teal" : "text-rust"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-muted text-sm font-mono">Qty</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-ink border hairline rounded-sm px-3 py-1 w-20 text-paper focus:border-brass outline-none"
            />
          </div>
        )}

        <button
          onClick={addToCart}
          disabled={product.stock <= 0}
          className="w-full bg-brass text-ink font-mono py-2 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {product.stock <= 0 ? "Unavailable" : "Add to cart"}
        </button>

        {message && <p className="text-teal text-sm font-mono">{message}</p>}
      </div>
    </div>
  );
}
