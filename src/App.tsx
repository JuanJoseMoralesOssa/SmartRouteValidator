import './App.css'
import { useEffect, useState } from 'react'
import { Route } from './types/Route'
import RouteCreate from './components/RouteCreate'
import RouteVisualization from './components/RouteVisualization'
import RoutesTable from './components/RouteTable'
import useRouteStore from './stores/useRouteStore'
import { DEFAULTCITY } from './constants/cts'

function App() {
    const { routes, setRoutes } = useRouteStore()

    console.log('App renderizado con routes:', routes?.length || 0)

    // Inicializar routes si es null
    useEffect(() => {
        if (routes === null) {
            setRoutes([])
        }
    }, [routes, setRoutes])

    const [error, setError] = useState<string | null>(null)

    const validateRoute = (): boolean => {
        // Verificar si existe una ruta con escalas más económica
        // const indirectRoutes = routes.filter(
        //     (r) =>
        //         !r.isDirectRoute &&
        //         r.originCity === route.originCity &&
        //         r.destinationCity === route.destinationCity
        // )

        // for (const indirectRoute of indirectRoutes) {
        //     if (indirectRoute.cost < (route.cost || 0)) {
        //         setError(
        //             `Error: Existe una ruta con escalas más económica (${indirectRoute.cost})`
        //         )
        //         return false
        //     }
        // }

        return true
    }

    const handleSaveRoute = (newRoute: Partial<Route>) => {
        if (routes === null) {
            return setError('Error: No se pudo cargar las rutas')
        }

        setError(null)

        if (!validateRoute()) {
            return
        }

        const routeToSave: Route = {
            id: newRoute.id ?? Math.random().toString(36).slice(2, 11),
            origin: newRoute.origin ?? DEFAULTCITY,
            destiny: newRoute.destiny ?? DEFAULTCITY,
            cost: newRoute.cost ?? 0,
            isDirectRoute: newRoute.isDirectRoute ?? false,
            intermediateStops: newRoute.intermediateStops ?? [],
        }

        if (newRoute.id) {
            const updatedRoutes = routes.map((r) => (r.id === newRoute.id ? routeToSave : r))
            setRoutes(updatedRoutes)
            console.log('Ruta editada:', routeToSave)
        } else {
            const updatedRoutes = [...routes, routeToSave]
            setRoutes(updatedRoutes)
            console.log('Nueva ruta creada:', routeToSave)
        }
    }

    const handleDeleteRoute = (routeId: string) => {
        if (routes === null) {
            return setError('Error: No se pudo cargar las rutas')
        }

        // Filtrar la ruta a eliminar
        const updatedRoutes = routes.filter((r) => r.id !== routeId)
        setRoutes(updatedRoutes)
        setError(null)

        console.log('Ruta eliminada, rutas actualizadas:', updatedRoutes)
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
            <div className='container mx-auto px-4 py-8 space-y-8'>
                {/* Header Section */}
                <div className='text-center space-y-4'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                        🚀 Sistema de Rutas de Transporte
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        Gestiona y visualiza las rutas de transporte de manera eficiente
                    </p>

                    {/* Statistics Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-6'>
                        <div className='bg-white rounded-xl shadow-md p-4 border border-gray-200'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Total Rutas</p>
                                    <p className='text-2xl font-bold text-blue-600'>{routes?.length || 0}</p>
                                </div>
                                <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <span className='text-2xl'>🗺️</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-xl shadow-md p-4 border border-gray-200'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Rutas Directas</p>
                                    <p className='text-2xl font-bold text-green-600'>
                                        {routes?.filter(r => r.isDirectRoute).length || 0}
                                    </p>
                                </div>
                                <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                                    <span className='text-2xl'>🚀</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-xl shadow-md p-4 border border-gray-200'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Con Escalas</p>
                                    <p className='text-2xl font-bold text-orange-600'>
                                        {routes?.filter(r => !r.isDirectRoute).length || 0}
                                    </p>
                                </div>
                                <div className='h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                                    <span className='text-2xl'>🔄</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-xl shadow-md p-4 border border-gray-200'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Costo Promedio</p>
                                    <p className='text-2xl font-bold text-purple-600'>
                                        ${routes?.length ? (routes.reduce((sum, r) => sum + r.cost, 0) / routes.length).toFixed(0) : '0'}
                                    </p>
                                </div>
                                <div className='h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                    <span className='text-2xl'>💰</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className='bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm'>
                        <div className='flex'>
                            <div className='flex-shrink-0'>
                                <span className='text-red-400 text-xl'>⚠️</span>
                            </div>
                            <div className='ml-3'>
                                <p className='text-sm text-red-700'>
                                    <strong className='font-semibold'>Error:</strong> {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Section */}
                <div className='flex justify-center'>
                    <RouteCreate onSave={handleSaveRoute} />
                </div>

                {/* Main Content Grid */}
                <div className='space-y-8'>
                    {/* Visualization Section */}
                    <div>
                        <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
                            <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4'>
                                <h2 className='text-xl font-semibold text-white flex items-center'>
                                    <span className='mr-2'>📊</span>
                                    {' '}Visualización de Rutas
                                </h2>
                                <p className='text-blue-100 text-sm mt-1'>
                                    Mapa interactivo de conexiones entre ciudades
                                </p>
                            </div>
                            <div className='p-6'>
                                <RouteVisualization />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div>
                        <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
                            <div className='bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4'>
                                <h2 className='text-xl font-semibold text-white flex items-center'>
                                    <span className='mr-2'>📋</span>
                                    Lista de Rutas
                                </h2>
                                <p className='text-green-100 text-sm mt-1'>
                                    Gestión completa de todas las rutas
                                </p>
                            </div>
                            <div className='p-6'>
                                <RoutesTable onDeleteRoute={handleDeleteRoute} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='text-center py-8'>
                    <p className='text-gray-500 text-sm'>
                        Sistema de Rutas de Transporte - Desarrollado con ❤️
                    </p>
                </div>
            </div>
        </div>
    )
}

export default App
