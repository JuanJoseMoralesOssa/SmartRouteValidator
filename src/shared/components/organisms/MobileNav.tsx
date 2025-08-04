import { Link, useLocation } from 'react-router-dom'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/cities', label: 'Ciudades', icon: '🏙️' }
]

export default function MobileNav({ isOpen, onClose }: Readonly<MobileNavProps>) {
  const location = useLocation()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Menú desplegable */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 lg:hidden border-b border-gray-200 mobile-nav-slide">
        {/* Header del menú */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Navegación
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items de navegación */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-base">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
