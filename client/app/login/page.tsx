"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { ApiResponse, User } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", {
        email,
        password,
      });
      login(res.data.data.user, res.data.data.token);
      router.push("/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <p className="catalog-number mb-2">Entry 01</p>
      <h1 className="font-display text-3xl text-paper mb-8">Log in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1 font-mono">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1 font-mono">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none"
          />
        </div>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brass text-ink font-mono py-2 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-muted text-sm mt-6">
        No account?{" "}
        <Link href="/register" className="text-brass hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
