interface HamburgerMenuProps {
  isOpen: boolean
  toggle: () => void
}

export default function HamburgerMenu({ isOpen, toggle }: Readonly<HamburgerMenuProps>) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''
          }`} />
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''
          }`} />
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`} />
      </div>
    </button>
  )
}
