import { create } from "zustand";
import { persist } from "zustand/middleware";
interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  picture: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => {
        set({ user: null });
        useUserStore.persist.clearStorage();
      },
    }),
    {
      name: "user-storage",
    }
  )
);
