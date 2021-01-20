import create from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  selectUser: (user: string) => set(() => ({ user }))
}));
