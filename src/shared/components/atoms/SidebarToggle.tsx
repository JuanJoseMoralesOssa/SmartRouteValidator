interface SidebarToggleProps {
  onClick: () => void
  className?: string
}

export default function SidebarToggle({ onClick, className = '' }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label="Abrir menú lateral"
      title="Abrir menú lateral"
    >
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}
