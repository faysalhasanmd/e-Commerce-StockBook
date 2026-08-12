"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Lock,
  ShieldCheck,
  LogIn,
  Check,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const { user, login, token } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Ensure we have the latest user details from the server (in case role changed)
  useEffect(() => {
    const refreshUser = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/users/${user.id}`);
        const latest = res.data.data;
        // update stored session keeping the same token
        login(latest, token as string);
      } catch (e) {
        // ignore — fallback to cookie-stored user
      }
    };
    refreshUser();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <LogIn className="mx-auto text-muted mb-3" size={32} />
        <p className="text-paper font-medium mb-1">
          Log in to view your profile
        </p>
        <Link href="/login" className="text-brass text-sm hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      const payload: Record<string, string> = { name, email };
      if (password) payload.password = password;

      const res = await api.patch(`/users/${user.id}`, payload);
      const updatedUser = { ...user, ...res.data.data };

      // Refresh the stored session with the updated details, keeping the same token
      login(updatedUser, token as string);
      setPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-14 h-14 rounded-full bg-brass/15 text-brass font-mono text-xl flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-3xl text-paper">{user.name}</h1>
          <span className="inline-flex items-center gap-1 text-muted text-xs mt-1">
            <ShieldCheck size={13} className="text-brass" />
            {user.role}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSave}
        className="bg-panel border border-line rounded-xl p-6 space-y-4"
      >
        <h2 className="text-paper font-medium mb-1">Account details</h2>

        <div>
          <label className="flex items-center gap-1.5 text-xs text-muted mb-1.5 font-medium">
            <UserIcon size={13} /> Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper focus:border-brass outline-none transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs text-muted mb-1.5 font-medium">
            <Mail size={13} /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper focus:border-brass outline-none transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs text-muted mb-1.5 font-medium">
            <Lock size={13} /> New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            minLength={6}
            className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-paper placeholder:text-muted/60 focus:border-brass outline-none transition-colors"
          />
        </div>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 ${
            saved ? "bg-teal text-white" : "bg-brass text-ink hover:opacity-90"
          }`}
        >
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : submitting ? (
            "Saving…"
          ) : (
            "Save changes"
          )}
        </button>
      </form>
    </div>
  );
}
