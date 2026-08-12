"use client";

import { useState } from "react";
import useSWR from "swr";
import Swal from "sweetalert2";
import {
  Users as UsersIcon,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse, User } from "@/types";
import { useAuthStore } from "@/store/authStore";
import AdminNav from "@/components/AdminNav";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const roleStyle: Record<string, string> = {
  ADMIN: "bg-rust/10 text-rust",
  MANAGER: "bg-brass/10 text-brass",
  CUSTOMER: "bg-teal/10 text-teal",
};

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const { data, isLoading, mutate } = useSWR<ApiResponse<User[]>>(
    "/users",
    fetcher,
  );
  const users = data?.data || [];
  const [roleUpdates, setRoleUpdates] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!user || user.role !== "MANAGER") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <ShieldAlert className="mx-auto text-rust mb-3" size={32} />
        <p className="text-paper font-medium mb-1">Manager access required</p>
        <p className="text-muted text-sm">
          This page is only visible to manager accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminNav />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-lg bg-brass/10 flex items-center justify-center">
          <UsersIcon size={20} className="text-brass" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-paper">Users</h1>
          <p className="text-muted text-sm">
            {user.role === "MANAGER"
              ? "View registered accounts (read-only)"
              : "View and manage registered accounts"}
          </p>
        </div>
      </div>

      <div className="bg-panel border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <span className="text-sm text-muted font-medium">
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        </div>

        {isLoading && (
          <p className="text-muted text-sm px-5 py-6 text-center">Loading…</p>
        )}

        {!isLoading && users.length === 0 && (
          <p className="text-muted text-sm px-5 py-8 text-center">
            No users found.
          </p>
        )}

        <ul>
          {users.map((u, i) => {
            const canEditRole =
              user?.role === "ADMIN" ||
              (user?.role === "MANAGER" && u.role !== "ADMIN");
            return (
              <li
                key={u.id}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 ${
                  i !== users.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="flex items-center gap-3 col-span-1">
                  <span className="w-9 h-9 rounded-full bg-line/40 flex items-center justify-center text-muted shrink-0">
                    <UserIcon size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-paper font-medium truncate">{u.name}</p>
                    <p className="text-muted text-xs truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-1">
                  <span
                    className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${roleStyle[u.role]}`}
                  >
                    {u.role === "ADMIN" && <ShieldCheck size={11} />}
                    {u.role}
                  </span>
                  <select
                    value={roleUpdates[u.id] ?? u.role}
                    onChange={(e) =>
                      setRoleUpdates((prev: Record<string, string>) => ({
                        ...prev,
                        [u.id]: e.target.value,
                      }))
                    }
                    disabled={!canEditRole || u.id === user?.id}
                    className="bg-ink border border-line rounded-lg px-3 py-2 text-sm text-paper focus:border-brass outline-none transition-colors"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN" disabled={user?.role !== "ADMIN"}>
                      ADMIN
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-2 justify-end col-span-1">
                  <button
                    onClick={async () => {
                      const selectedRole = roleUpdates[u.id] ?? u.role;
                      if (selectedRole === u.role) return;
                      if (u.id === user?.id) return;

                      setSavingId(u.id);
                      try {
                        await api.patch(`/users/${u.id}`, {
                          role: selectedRole,
                        });
                        await mutate();
                        Swal.fire({
                          title: "Saved",
                          text: "User role updated successfully.",
                          icon: "success",
                        });
                      } catch (err: any) {
                        Swal.fire({
                          title: "Error",
                          text:
                            err?.response?.data?.message ||
                            "Could not update user role.",
                          icon: "error",
                        });
                      } finally {
                        setSavingId(null);
                      }
                    }}
                    disabled={
                      savingId === u.id || !canEditRole || u.id === user?.id
                    }
                    className="text-sm bg-brass text-ink px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {savingId === u.id ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={async () => {
                      const confirm = await Swal.fire({
                        title: "Delete user?",
                        text: `Delete ${u.name}? This can be restored by an admin if soft delete is enabled.`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, delete",
                        cancelButtonText: "Cancel",
                      });
                      if (!confirm.isConfirmed) return;
                      setDeletingId(u.id);
                      try {
                        await api.delete(`/users/${u.id}`);
                        await mutate();
                        Swal.fire({
                          title: "Deleted",
                          text: "User account deleted.",
                          icon: "success",
                        });
                      } catch (err: any) {
                        Swal.fire({
                          title: "Error",
                          text:
                            err?.response?.data?.message ||
                            "Could not delete user.",
                          icon: "error",
                        });
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    disabled={
                      deletingId === u.id ||
                      u.role === "ADMIN" ||
                      u.id === user?.id
                    }
                    className="text-sm text-rust px-3 py-2 rounded-lg border border-rust hover:bg-rust/10 transition-colors disabled:opacity-50"
                  >
                    {deletingId === u.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {user.role === "MANAGER" && (
        <p className="text-muted text-xs mt-4 text-center">
          Managers have view-only access. Contact an admin to change roles or
          remove accounts.
        </p>
      )}
    </div>
  );
}
