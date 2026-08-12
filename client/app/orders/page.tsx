"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  Receipt,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  PackageCheck,
  LogIn,
  ShoppingBag,
} from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse, Order, OrderStatus } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  PENDING: { label: "Pending", color: "text-brass bg-brass/10", icon: Clock },
  PROCESSING: {
    label: "Processing",
    color: "text-brass bg-brass/10",
    icon: Clock,
  },
  SHIPPED: { label: "Shipped", color: "text-teal bg-teal/10", icon: Truck },
  DELIVERED: {
    label: "Delivered",
    color: "text-teal bg-teal/10",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rust bg-rust/10",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const ordersUrl = user ? `/orders/user/${user.id}` : null;
  const { data, isLoading } = useSWR<ApiResponse<Order[]>>(ordersUrl, fetcher);
  const orders = data?.data || [];

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <LogIn className="mx-auto text-muted mb-3" size={32} />
        <p className="text-paper font-medium mb-1">Log in to see your orders</p>
        <Link href="/login" className="text-brass text-sm hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-lg bg-brass/10 flex items-center justify-center">
          <Receipt size={20} className="text-brass" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-paper">Your orders</h1>
          <p className="text-muted text-sm">Track and review past purchases</p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 bg-panel border border-line rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="text-center py-16 bg-panel border border-line rounded-xl">
          <ShoppingBag className="mx-auto text-muted mb-3" size={32} />
          <p className="text-paper font-medium mb-1">No orders yet</p>
          <p className="text-muted text-sm mb-4">
            Items you order will show up here.
          </p>
          <Link
            href="/products"
            className="inline-block bg-brass text-ink px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse the catalog
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const { label, color, icon: StatusIcon } = statusConfig[order.status];
          const itemCount = order.orderItems.reduce(
            (sum, i) => sum + i.quantity,
            0,
          );

          return (
            <div
              key={order.id}
              className="bg-panel border border-line rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <div>
                  <p className="text-paper font-mono text-sm">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-muted text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${color}`}
                >
                  <StatusIcon size={13} />
                  {label}
                </span>
              </div>

              {/* Items */}
              <ul className="px-5 py-3 divide-y divide-line">
                {order.orderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="text-paper">
                      {item.product.title}{" "}
                      <span className="text-muted font-mono">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="font-mono text-muted">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 bg-ink/40 border-t border-line">
                <div className="flex items-center gap-1.5 text-muted text-xs">
                  <PackageCheck size={14} />
                  Order total
                </div>
                <span className="font-mono text-paper text-lg font-medium">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
