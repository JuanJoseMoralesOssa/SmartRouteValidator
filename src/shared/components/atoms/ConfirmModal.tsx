import { useConfirmStore } from "@/shared/stores/confirmStore";
import { useEffect, useRef, useState, useCallback } from "react";

export function ConfirmModal() {
  const { title, message, variant, resolve, clearConfirm } = useConfirmStore();
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  // Mostrar modal cuando hay datos
  useEffect(() => {
    if (title && message) {
      setIsVisible(true);
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [title, message]);


  const handleCancel = useCallback(() => {
    resolve?.(false);
    setIsVisible(false);
    setTimeout(clearConfirm, 150);
  }, [resolve, clearConfirm]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isVisible, handleCancel]);

  if (!title || !message) return null;

  const handleConfirm = () => {
    resolve?.(true);
    setIsVisible(false);
    setTimeout(clearConfirm, 150);
  };


  // Cerrar al hacer click fuera
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      handleCancel();
    }
  };

  // Variantes de diseño
  const variants = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      headerBg: "bg-gradient-to-r from-red-50 to-orange-50 border-red-100",
      confirmBg:
        "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500",
    },
    success: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      headerBg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-100",
      confirmBg:
        "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      headerBg: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100",
      confirmBg:
        "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500",
    },
  };

  const v = variants[variant ?? "danger"];

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
        }`}
    >
      <img alt="Backdrop" style={{ display: "none" }} />
      <dialog
        ref={modalRef}
        open={isVisible}
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="bg-transparent border-0 outline-none max-w-sm w-full mx-auto"
      >
        <div
          className={`p-6 text-center transition-all duration-300 transform ${isVisible
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
            }`}
        >
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className={`${v.headerBg} px-6 py-4 border-b`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 ${v.iconBg} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className={`w-6 h-6 ${v.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0
                         2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732
                         0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    id="confirm-modal-title"
                    className="text-lg font-semibold text-gray-900 leading-6"
                  >
                    {title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p
                id="confirm-modal-message"
                className="text-gray-700 text-sm leading-relaxed"
              >
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${v.confirmBg} border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
