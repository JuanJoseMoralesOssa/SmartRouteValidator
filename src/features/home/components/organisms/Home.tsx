import { useRouteController } from '@/features/route/hooks/useRouteController'
import ErrorAlert from '../atoms/ErrorAlert'
import HomeHeader from '../molecules/HomeHeader'
import Footer from '@/shared/components/atoms/Footer'
import ActionSection from '../molecules/ActionSection'
import MainContent from '@/features/route/components/organisms/MainContent'

function Home() {
  const { routes } = useRouteController()

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Espaciado para el header fijo */}
      <div className='pt-4'>
        <div className='container mx-auto px-4 py-8 space-y-8 max-w-7xl'>
          <HomeHeader routes={routes} />
          <ErrorAlert />
          <ActionSection />
          <MainContent />
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Home
