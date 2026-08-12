"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { ApiResponse, User } from "@/types";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<{ user: User; token: string }>>(
        "/auth/register",
        {
          name,
          email,
          password,
        },
      );
      login(res.data.data.user, res.data.data.token);
      router.push("/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-panel/80 backdrop-blur-md border border-line rounded-xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="catalog-number text-xs font-mono tracking-widest text-brass uppercase block mb-2">
            Entry 00 — Registration
          </span>
          <h1 className="font-display text-3xl text-paper font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted mt-2">
            Join us by filling out your information below
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-rust/10 border border-rust/30 flex items-start gap-3 text-rust text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ink/50 border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-paper placeholder:text-muted/50 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink/50 border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-paper placeholder:text-muted/50 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted">
                Password
              </label>
              <span className="text-[10px] font-mono text-muted/70">
                Min. 6 characters
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink/50 border border-line rounded-lg pl-10 pr-11 py-2.5 text-sm text-paper placeholder:text-muted/50 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-paper transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-brass text-ink font-medium text-sm py-2.5 px-4 rounded-lg hover:opacity-90 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-line/60 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brass hover:underline font-medium transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
