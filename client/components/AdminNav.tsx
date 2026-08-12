"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Package, Tag, Users as UsersIcon } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const tabs = [
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    ...(user?.role === "MANAGER"
      ? [{ href: "/admin/users", label: "Users", icon: UsersIcon }]
      : []),
  ];

  return (
    <div className="flex gap-1 border-b border-line mb-8">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition-colors ${
              active
                ? "border-brass text-paper font-medium"
                : "border-transparent text-muted hover:text-paper"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
