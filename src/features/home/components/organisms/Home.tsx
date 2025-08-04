import { useEffect } from 'react'
import useRouteStore from '@/features/route/stores/useRouteStore'
import { useRouteController } from '@/features/route/hooks/useRouteController'
import ErrorAlert from '../atoms/ErrorAlert'
import HomeHeader from '../molecules/HomeHeader'
import Footer from '@/shared/components/atoms/Footer'
import ActionSection from '../molecules/ActionSection'
import MainContent from '@/features/route/components/organisms/MainContent'

function Home() {
  const { items: routes, setItems: setRoutes } = useRouteStore()
  const { handleGetAllData } = useRouteController()

  useEffect(() => {
    if (routes === null) {
      setRoutes(handleGetAllData())
    }
  }, [routes, setRoutes, handleGetAllData])

  return (
    <div className='min-h-screen max-w-7xl my-0 mx-auto p-2 text-center bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      <div className='container mx-auto px-4 py-8 space-y-8'>
        <HomeHeader routes={routes} />
        <ErrorAlert />
        <ActionSection />
        <MainContent />
        <Footer />
      </div>
    </div>
  )
}

export default Home
