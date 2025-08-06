import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-50 modal-backdrop modal-enter">
      {/* Backdrop invisible para clicks */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <dialog className={`bg-white rounded-xl shadow-2xl w-full max-w-md h-fit max-h-[90vh] relative modal-content-enter ${className}`} open>
        <div className="flex flex-col h-full">
          {/* Header con título y botón X */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Cerrar modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="px-6 pb-6 pt-3 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </dialog>
    </div>,
    modalRoot
  )
}

export default Modal
