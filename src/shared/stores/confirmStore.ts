import { create } from "zustand";

interface ConfirmState {
  title?: string;
  message?: string;
  variant?: "danger" | "success" | "info";
  resolve?: (value: boolean) => void;
}

interface ConfirmStore extends ConfirmState {
  showConfirm: (
    title: string,
    message: string,
    variant?: ConfirmState["variant"]
  ) => Promise<boolean>;
  clearConfirm: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  title: undefined,
  message: undefined,
  variant: "danger",
  resolve: undefined,
  showConfirm: (title, message, variant = "danger") =>
    new Promise<boolean>((resolve) => {
      set({ title, message, variant, resolve });
    }),
  clearConfirm: () => set({ title: undefined, message: undefined, variant: "danger", resolve: undefined }),
}));
