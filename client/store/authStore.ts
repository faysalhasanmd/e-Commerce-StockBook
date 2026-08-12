import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  login: (user, token) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    set({ user, token });
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");
    set({ user: null, token: null });
  },

  // Called once on app load to restore session from cookies
  hydrate: () => {
    const token = Cookies.get("token");
    const rawUser = Cookies.get("user");
    if (token && rawUser) {
      set({ user: JSON.parse(rawUser), token, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },
}));
