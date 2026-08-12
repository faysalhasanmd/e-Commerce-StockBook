"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Tag, Plus, Trash2, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse, Category } from "@/types";
import { useAuthStore } from "@/store/authStore";
import AdminNav from "@/components/AdminNav";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function AdminCategoriesPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useSWR<ApiResponse<Category[]>>(
    "/categories",
    fetcher,
  );
  const categories = data?.data || [];
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <ShieldAlert className="mx-auto text-rust mb-3" size={32} />
        <p className="text-paper font-medium mb-1">Admin access required</p>
        <p className="text-muted text-sm">
          You don't have permission to manage categories.
        </p>
      </div>
    );
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/categories", { name });
      setName("");
      mutate("/categories");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/categories/${id}`);
      mutate("/categories");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AdminNav />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-lg bg-brass/10 flex items-center justify-center">
          <Tag size={20} className="text-brass" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-paper">Categories</h1>
          <p className="text-muted text-sm">
            Organize your catalog into groups
          </p>
        </div>
      </div>

      {/* Create form */}
      <form
        onSubmit={createCategory}
        className="bg-panel border border-line rounded-xl p-5 mb-8"
      >
        <label className="block text-sm text-muted mb-2 font-medium">
          New category
        </label>
        <div className="flex gap-2">
          <input
            placeholder="e.g. Electronics"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 bg-brass text-ink px-4 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
          >
            <Plus size={16} />
            {submitting ? "Adding…" : "Add"}
          </button>
        </div>
        {error && <p className="text-rust text-sm mt-2">{error}</p>}
      </form>

      {/* List */}
      <div className="bg-panel border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <span className="text-sm text-muted font-medium">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {isLoading && (
          <p className="text-muted text-sm px-5 py-6 text-center">Loading…</p>
        )}

        {!isLoading && categories.length === 0 && (
          <p className="text-muted text-sm px-5 py-8 text-center">
            No categories yet — add your first one above.
          </p>
        )}

        <ul>
          {categories.map((c, i) => (
            <li
              key={c.id}
              className={`flex items-center justify-between px-5 py-3.5 ${
                i !== categories.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-md bg-line/40 flex items-center justify-center text-muted">
                  <Tag size={14} />
                </span>
                <span className="text-paper font-medium">{c.name}</span>
              </div>

              <button
                onClick={() => deleteCategory(c.id)}
                disabled={deletingId === c.id}
                className="p-2 rounded-lg text-muted hover:text-rust hover:bg-rust/10 transition-colors disabled:opacity-50"
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
