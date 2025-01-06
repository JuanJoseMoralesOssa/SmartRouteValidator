import './App.css'
import { useState } from 'react'
import { Route } from './types/Route'
import RouteForm from './components/RouteFrom'
import RouteVisualization from './components/RouteVisualization'
import RoutesTable from './components/RouteTable'

function App() {
    const [routes, setRoutes] = useState<Route[]>([])
    const [error, setError] = useState<string | null>(null)

    const validateRoute = (route: Partial<Route>): boolean => {
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
        setError(null)

        if (!validateRoute(newRoute)) {
            return
        }

        const routeToSave: Route = {
            id: newRoute.id ?? Math.random().toString(36).slice(2, 11),
            originCity: newRoute.originCity ?? '',
            destinationCity: newRoute.destinationCity ?? '',
            cost: newRoute.cost ?? 0,
            isDirectRoute: newRoute.isDirectRoute ?? false,
            intermediateStops: newRoute.intermediateStops ?? [],
        }

        if (newRoute.id) {
            setRoutes(routes.map((r) => (r.id === newRoute.id ? routeToSave : r)))
        } else {
            setRoutes([...routes, routeToSave])
        }

        console.log('====================================')
        console.log(routes)
        console.log('====================================')
    }

    const handleDeleteRoute = (routeId: string) => {
        setRoutes(routes.filter((r) => r.id !== routeId))
        setError(null)
    }

    return (
        <div className='container mx-auto py-8 space-y-6'>
            <h1 className='text-3xl font-bold'>Sistema de Rutas de Transporte</h1>

            {error && (
                <div
                    className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
                    role='alert'>
                    <strong className='font-bold'>Error:</strong>
                    <span className='block sm:inline'>{error}</span>
                </div>
            )}

            <div className='flex justify-between items-center'>
                <RouteForm onSave={handleSaveRoute} />
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
                <div>
                    <h2 className='text-xl font-semibold mb-4'>
                        Visualización de Rutas
                    </h2>
                    <RouteVisualization routes={routes} />
                </div>
                <div>
                    <RoutesTable
                        routes={routes}
                        onEditRoute={(route) => (
                            <RouteForm
                                initialData={route}
                                onSave={handleSaveRoute}
                            />
                        )}
                        onDeleteRoute={handleDeleteRoute}
                    />
                </div>
            </div>
        </div>
    )
}

export default App
