"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  ShoppingCart,
  Package,
  LayoutGrid,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, hydrate, isHydrated } = useAuthStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const isActive = (href: string) =>
    href === "/products" ? pathname === "/products" : pathname.startsWith(href);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`relative px-1 py-1 text-sm transition-colors ${
        isActive(href)
          ? "text-paper font-medium"
          : "text-muted hover:text-paper"
      }`}
    >
      {label}
      {isActive(href) && (
        <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-brass rounded-full" />
      )}
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
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/products" label="Catalog" />
          {isHydrated && user && (
            <>
              <NavLink href="/orders" label="Orders" />
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <NavLink href="/admin/products" label="Add Item" />
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
                className={`p-2 rounded-full transition-colors ${
                  isActive("/cart")
                    ? "bg-brass/10 text-brass"
                    : "text-muted hover:text-paper hover:bg-panel"
                }`}
              >
                <ShoppingCart size={19} />
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
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                    >
                      <Package size={15} /> Orders
                    </Link>
                    {(user.role === "ADMIN" || user.role === "MANAGER") && (
                      <Link
                        href="/admin/products"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper hover:bg-line/40 md:hidden"
                      >
                        <LayoutGrid size={15} /> Add Item
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
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
