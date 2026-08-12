"use client";

import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ApiResponse, CartItem } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function CartPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const cartUrl = user ? `/cart-items/user/${user.id}` : null;
  const { data, isLoading } = useSWR<ApiResponse<CartItem[]> & { summary?: any }>(cartUrl, fetcher);
  const items = data?.data || [];

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    await api.patch(`/cart-items/${id}`, { quantity });
    mutate(cartUrl);
  };

  const removeItem = async (id: string) => {
    await api.delete(`/cart-items/${id}`);
    mutate(cartUrl);
  };

  const checkout = async () => {
    if (!user) return;
    await api.post("/orders", { userId: user.id });
    mutate(cartUrl);
    router.push("/orders");
  };

  if (!user) {
    return <p className="text-muted font-mono">Log in to see your cart.</p>;
  }

  if (isLoading) return <p className="text-muted font-mono">Loading cart…</p>;

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div>
      <p className="catalog-number mb-2">Your Selections</p>
      <h1 className="font-display text-4xl text-paper mb-8">Cart</h1>

      {items.length === 0 && <p className="text-muted font-mono">Your cart is empty.</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-panel border hairline rounded-sm p-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h3 className="font-display text-lg text-paper">{item.product.title}</h3>
              <p className="font-mono text-brass text-sm">${item.product.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.product.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              className="bg-ink border hairline rounded-sm px-2 py-1 w-16 text-paper focus:border-brass outline-none"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="text-rust text-sm font-mono hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 border-t hairline pt-6 flex items-center justify-between">
          <span className="font-mono text-muted">Total</span>
          <span className="font-mono text-brass text-2xl">${total.toFixed(2)}</span>
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={checkout}
          className="mt-4 w-full bg-brass text-ink font-mono py-3 rounded-sm hover:opacity-90 transition-opacity"
        >
          Place order
        </button>
      )}
    </div>
  );
}
