import { ReactNode } from 'react'
import Modal from './Modal'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export default function FormModal({ isOpen, onClose, title, children, className = '' }: Readonly<FormModalProps>) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
    >
      {children}
    </Modal>
  )
}
