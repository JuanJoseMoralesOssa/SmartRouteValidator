import { useToastStore } from "@/shared/stores/toastStore";
import ToastItem from "../atoms/ToasItem";

type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

interface ToastContainerProps {
  position?: ToastPosition;
}

export function ToastContainer({ position = "bottom-right" }: Readonly<ToastContainerProps>) {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const positionClasses: Record<ToastPosition, string> = {
    "top-left": "top-4 left-4 items-start",
    "top-right": "top-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  };

  return (
    <div
      className={`fixed flex flex-col space-y-3 z-50 pointer-events-none ${positionClasses[position]}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
