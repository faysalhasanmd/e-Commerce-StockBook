"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Package, Plus, Trash2, ShieldAlert, ImageOff } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { ApiResponse, Category, Product } from "@/types";
import { useAuthStore } from "@/store/authStore";
import AdminNav from "@/components/AdminNav";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const { data: productsRes, isLoading } = useSWR<ApiResponse<Product[]>>(
    "/products",
    fetcher,
  );
  const { data: categoriesRes } = useSWR<ApiResponse<Category[]>>(
    "/categories",
    fetcher,
  );
  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <ShieldAlert className="mx-auto text-rust mb-3" size={32} />
        <p className="text-paper font-medium mb-1">Admin access required</p>
        <p className="text-muted text-sm">
          You don't have permission to manage products.
        </p>
      </div>
    );
  }

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/products", {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        image: form.image || undefined,
      });
      setForm({
        title: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        image: "",
      });
      mutate("/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create product.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete product?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      await mutate("/products");
      await Swal.fire({
        title: "Deleted",
        text: "Product removed.",
        icon: "success",
      });
    } catch (err: any) {
      await Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Could not delete product.",
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AdminNav />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-lg bg-brass/10 flex items-center justify-center">
          <Package size={20} className="text-brass" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-paper">Products</h1>
          <p className="text-muted text-sm">
            Add and manage your catalog entries
          </p>
        </div>
      </div>

      {/* Create form */}
      <form
        onSubmit={createProduct}
        className="bg-panel border border-line rounded-xl p-6 mb-8"
      >
        <h2 className="text-paper font-medium mb-4">New product</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">
              Title
            </label>
            <input
              placeholder="e.g. Wireless Mouse"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">
              Category
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper focus:border-brass outline-none transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">
              Stock
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors font-mono"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-muted mb-1.5 font-medium">
            Image URL
          </label>
          <div className="flex gap-3 items-start">
            <input
              type="url"
              placeholder="https://example.com/product.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="flex-1 bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors"
            />
            <div className="w-16 h-16 rounded-lg border border-line bg-line/20 flex items-center justify-center overflow-hidden shrink-0">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              ) : (
                <ImageOff size={18} className="text-muted" />
              )}
            </div>
          </div>
          <p className="text-muted text-xs mt-1.5">
            Paste a direct image link (optional) — a placeholder icon shows if
            left blank.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-muted mb-1.5 font-medium">
            Description
          </label>
          <textarea
            placeholder="Short description shown on the catalog and product page…"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors resize-none"
          />
        </div>

        {error && <p className="text-rust text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 bg-brass text-ink px-4 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus size={16} />
          {submitting ? "Creating…" : "Create product"}
        </button>
      </form>

      {/* List */}
      <div className="bg-panel border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <span className="text-sm text-muted font-medium">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>

        {isLoading && (
          <p className="text-muted text-sm px-5 py-6 text-center">Loading…</p>
        )}

        {!isLoading && products.length === 0 && (
          <p className="text-muted text-sm px-5 py-8 text-center">
            No products yet — add your first one above.
          </p>
        )}

        <ul>
          {products.map((p, i) => {
            const outOfStock = p.stock <= 0;
            const lowStock = !outOfStock && p.stock <= 5;
            return (
              <li
                key={p.id}
                className={`flex items-center gap-4 px-5 py-3.5 ${
                  i !== products.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className="w-10 h-10 rounded-md bg-line/40 flex items-center justify-center text-muted shrink-0 overflow-hidden">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageOff size={16} />
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-paper font-medium truncate">{p.title}</p>
                  <p className="text-muted text-xs">
                    {categories.find((c) => c.id === p.categoryId)?.name ||
                      "Uncategorized"}
                  </p>
                </div>

                <span className="font-mono text-paper text-sm w-16 text-right shrink-0">
                  ${p.price.toFixed(2)}
                </span>

                <span
                  className={`text-[11px] font-mono px-2 py-1 rounded-full shrink-0 ${
                    outOfStock
                      ? "bg-rust/10 text-rust"
                      : lowStock
                        ? "bg-brass/10 text-brass"
                        : "bg-teal/10 text-teal"
                  }`}
                >
                  {outOfStock ? "Out of stock" : `${p.stock} in stock`}
                </span>

                <button
                  onClick={() => deleteProduct(p.id)}
                  disabled={deletingId === p.id}
                  className="p-2 rounded-lg text-muted hover:text-rust hover:bg-rust/10 transition-colors disabled:opacity-50 shrink-0"
                  aria-label={`Delete ${p.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
