import { useToastStore } from "@/shared/stores/toastStore";

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);
  return {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    warning: (msg: string) => addToast(msg, 'warning'),
    info: (msg: string) => addToast(msg, 'info'),
  };
};
