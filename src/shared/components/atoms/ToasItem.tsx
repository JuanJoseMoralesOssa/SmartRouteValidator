import { useEffect, useState, useCallback } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: number) => void;
}

export default function ToastItem({ toast, onRemove }: Readonly<ToastItemProps>) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    let autoDismissTimer: ReturnType<typeof setTimeout> | undefined;
    if (!isPaused) {
      autoDismissTimer = setTimeout(() => handleRemove(), 4000);
    }

    return () => {
      clearTimeout(enterTimer);
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
    };
  }, [handleRemove, isPaused]);

  const getToastConfig = (type: Toast["type"]) => {
    const baseConfig = {
      success: {
        bgClass: "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600",
        borderClass: "border-emerald-400",
        iconBg: "bg-emerald-600/20",
        iconPath: "M5 13l4 4L19 7"
      },
      error: {
        bgClass: "bg-gradient-to-r from-red-500 via-rose-500 to-red-600",
        borderClass: "border-red-400",
        iconBg: "bg-red-600/20",
        iconPath: "M6 18L18 6M6 6l12 12"
      },
      warning: {
        bgClass: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500",
        borderClass: "border-amber-400",
        iconBg: "bg-amber-600/20",
        iconPath: "M12 9v2m0 4h.01M5.062 19h13.876c1.54 0 2.5-1.667 1.732-2.5L13.732 4a2 2 0 00-3.464 0L3.33 16.5C2.56 17.333 3.522 19 5.062 19z"
      },
      info: {
        bgClass: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600",
        borderClass: "border-blue-400",
        iconBg: "bg-blue-600/20",
        iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    };
    return baseConfig[type];
  };

  const config = getToastConfig(toast.type);

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out max-w-sm w-full
        ${isVisible && !isLeaving
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"}
      `}
    >
      <div
        className={`
          ${config.bgClass} ${config.borderClass}
          border rounded-xl shadow-lg hover:shadow-xl
          backdrop-blur-sm text-white
          transition-all duration-200 hover:scale-105 cursor-pointer
          relative overflow-hidden group w-full text-left
        `}
        onClick={handleRemove}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRemove();
          }
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="button"
        tabIndex={0}
        aria-live="polite"
        aria-label={`${toast.type} notification: ${toast.message}. Click to dismiss.`}
      >
        {/* Brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>

        <div className="relative flex items-center space-x-3 p-4">
          {/* Icono */}
          <div className={`flex-shrink-0 w-8 h-8 ${config.iconBg} rounded-full flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.iconPath} />
            </svg>
          </div>

          {/* Mensaje */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5 text-white/95">
              {toast.message}
            </p>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            aria-label="Cerrar notificación"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white/40 animate-toast-progress origin-left"></div>
        </div>
      </div>
    </div>
  );
}
