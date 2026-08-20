"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { ApiResponse, CartItem } from "@/types";
import {
  Home,
  ShoppingCart,
  Package,
  Tag,
  Users,
  LayoutGrid,
  LogOut,
  ChevronDown,
  User,
  Mail,
} from "lucide-react";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function Navbar() {
  const { user, logout, hydrate, isHydrated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter(); // useRouter Hook
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: cartRes } = useSWR<ApiResponse<CartItem[]>>(
    user ? `/cart-items/user/${user.id}` : null,
    fetcher,
  );
  const cartCount = (cartRes?.data || []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Close the account menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Handle Logout & Navigation
  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push("/login"); // Logout-এর পর login page-এ নেভিগেট করবে
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
        isActive(href)
          ? "bg-brass/10 text-brass font-medium"
          : "text-muted hover:text-paper hover:bg-line/40"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-md bg-brass flex items-center justify-center font-display text-ink text-lg">
            E
          </span>
          <span className="font-display text-xl tracking-tight text-paper hidden sm:block">
            E-Commerce
          </span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
          <NavLink href="/products" label="All Items" />
          <NavLink href="/contact" label="Contact" />
          {isHydrated && user && (
            <>
              <NavLink href="/orders" label="Orders" />
              <NavLink href="/profile" label="Profile" />
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <>
                  <NavLink href="/admin/products" label="Add products" />
                  <NavLink href="/admin/categories" label="Add categories" />
                  {user.role === "MANAGER" && (
                    <NavLink href="/admin/users" label="Manage users" />
                  )}
                </>
              )}
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isHydrated && user && (
            <>
              <Link
                href="/cart"
                aria-label="Cart"
                className={`relative p-2 rounded-full transition-colors ${
                  isActive("/cart")
                    ? "bg-brass/10 text-brass"
                    : "text-muted hover:text-paper hover:bg-panel"
                }`}
              >
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-ink text-[10px] font-mono font-bold flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-line hover:border-brass/50 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-brass/15 text-brass font-mono text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm text-paper hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className="text-muted" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-panel border border-line rounded-lg shadow-lg py-1 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm text-paper font-medium">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted">{user.email}</p>
                      <p className="text-xs text-muted">Role: {user.role}</p>
                    </div>
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                    >
                      <Home size={15} /> Home
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                    >
                      <LayoutGrid size={15} /> About
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                    >
                      <Mail size={15} /> Contact
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                    >
                      <Package size={15} /> Orders
                    </Link>
                    {(user.role === "ADMIN" || user.role === "MANAGER") && (
                      <>
                        <Link
                          href="/admin/products"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                        >
                          <Package size={15} /> Products
                        </Link>
                        <Link
                          href="/admin/categories"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                        >
                          <Tag size={15} /> Categories
                        </Link>
                        {user.role === "MANAGER" && (
                          <Link
                            href="/admin/users"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                          >
                            <Users size={15} /> Users
                          </Link>
                        )}
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rust hover:bg-rust/10 transition-colors"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {isHydrated && !user && (
            <>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-paper transition-colors px-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-brass text-ink px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
