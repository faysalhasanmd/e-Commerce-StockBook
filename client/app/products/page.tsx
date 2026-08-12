"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import api from "@/lib/axios";
import { ApiResponse, Category, Product } from "@/types";
import ProductCard from "@/components/ProductCard";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProductsPage() {
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");

  const query = new URLSearchParams();
  if (categoryId) query.set("categoryId", categoryId);
  if (search) query.set("search", search);

  const { data: productsRes, isLoading } = useSWR<ApiResponse<Product[]>>(
    `/products?${query.toString()}`,
    fetcher
  );
  const { data: categoriesRes } = useSWR<ApiResponse<Category[]>>("/categories", fetcher);

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];

  return (
    <div>
      <p className="catalog-number mb-2">The Catalog</p>
      <h1 className="font-display text-4xl text-paper mb-8">Every item, kept in order</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          placeholder="Search the catalog…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-panel border hairline rounded-sm px-3 py-2 text-paper flex-1 min-w-[200px] focus:border-brass outline-none"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-muted font-mono">Loading catalog…</p>}

      {!isLoading && products.length === 0 && (
        <p className="text-muted font-mono">No items match — try a different search or category.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
