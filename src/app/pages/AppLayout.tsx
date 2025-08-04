import Breadcrumb from '@/shared/components/atoms/Breadcrumb'
import { Outlet, useLocation } from 'react-router-dom'
import { useSidebar } from '@/shared/hooks/useSidebar'
import AppHeader from '@/shared/components/organisms/AppHeader'
import MobileNav from '@/shared/components/organisms/MobileNav'
import Footer from '@/shared/components/atoms/Footer'

export default function AppLayout() {
  const location = useLocation()
  const { isOpen, toggle, close } = useSidebar()
  const isCityDetail = location.pathname.startsWith('/cities/') && location.pathname.split('/').length > 2
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header siempre presente */}
      <AppHeader onMenuToggle={toggle} isMenuOpen={isOpen} />

      {/* Navegación móvil */}
      <MobileNav isOpen={isOpen} onClose={close} />

      {/* Contenido principal */}
      <main className={`${isHome ? '' : 'p-6'}`}>
        {isCityDetail && <Breadcrumb />}
        <Outlet />
      </main>

      {/* Footer condicional */}
      {!isHome && <Footer />}
    </div>
  )
}
