import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ConfirmState {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ToastStore {
  toasts: Toast[];
  confirmState: ConfirmState | null;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
  confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
  clearConfirm: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  confirmState: null,

  addToast: (message, type = 'info') => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  confirm: (title, message, onConfirm, onCancel) => {
    set({ confirmState: { title, message, onConfirm, onCancel } });
  },

  clearConfirm: () => set({ confirmState: null }),
}));
