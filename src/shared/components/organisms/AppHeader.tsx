import { useLocation, Link } from 'react-router-dom'
import HamburgerMenu from '../atoms/HamburgerMenu'

interface AppHeaderProps {
  onMenuToggle: () => void
  isMenuOpen: boolean
}

const navigationItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/cities', label: 'Ciudades', icon: '🏙️' }
]

export default function AppHeader({ onMenuToggle, isMenuOpen }: Readonly<AppHeaderProps>) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const getPageTitle = () => {
    if (location.pathname === '/cities') {
      return '🏙️ Ciudades'
    } else if (location.pathname.startsWith('/cities/')) {
      return '🏙️ Detalle de Ciudad'
    } else {
      return 'Smart Route Validator'
    }
  }

  return (
    <header className={`bg-gradient-to-r from-blue-50 via-blue-50 to-white border-b border-gray-200 px-4 py-3 ${isHome ? 'bg-transparent border-transparent' : ''}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo y menú hamburguesa */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <HamburgerMenu isOpen={isMenuOpen} toggle={onMenuToggle} />
          </div>

          {!isHome && (
            <h1 className="text-xl font-semibold text-gray-700">
              {getPageTitle()}
            </h1>
          )}

          {isHome && (
            <div className="text-lg font-semibold text-gray-700">
              🚀 Smart Route Validator
            </div>
          )}
        </div>

        {/* Navegación desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200"

            let linkClasses = baseClasses
            if (isActive) {
              linkClasses += " bg-blue-100 text-blue-700 font-medium"
            } else if (isHome) {
              linkClasses += " text-gray-700 hover:bg-blue-300/20 hover:backdrop-blur-sm"
            } else {
              linkClasses += " text-gray-700 hover:bg-gray-200"
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={linkClasses}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Área de usuario */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors cursor-pointer">
            <span className="text-sm">👤</span>
          </div>
        </div>
      </div>
    </header>
  )
}
