"use client";

import useSWR from "swr";
import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const statusColor: Record<string, string> = {
  PENDING: "text-brass",
  PROCESSING: "text-brass",
  SHIPPED: "text-teal",
  DELIVERED: "text-teal",
  CANCELLED: "text-rust",
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const ordersUrl = user ? `/orders/user/${user.id}` : null;
  const { data, isLoading } = useSWR<ApiResponse<Order[]>>(ordersUrl, fetcher);
  const orders = data?.data || [];

  if (!user) return <p className="text-muted font-mono">Log in to see your orders.</p>;
  if (isLoading) return <p className="text-muted font-mono">Loading orders…</p>;

  return (
    <div>
      <p className="catalog-number mb-2">Order History</p>
      <h1 className="font-display text-4xl text-paper mb-8">Your orders</h1>

      {orders.length === 0 && <p className="text-muted font-mono">No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-panel border hairline rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="catalog-number">{order.id.slice(0, 8)}</span>
              <span className={`font-mono text-sm ${statusColor[order.status]}`}>
                {order.status}
              </span>
            </div>

            <ul className="space-y-1 mb-3">
              {order.orderItems.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-muted">
                  <span>
                    {item.product.title} × {item.quantity}
                  </span>
                  <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between border-t hairline pt-3">
              <span className="text-muted text-sm font-mono">Total</span>
              <span className="font-mono text-brass">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
