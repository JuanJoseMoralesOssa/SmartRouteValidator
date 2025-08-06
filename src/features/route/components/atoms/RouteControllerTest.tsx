import React from 'react'
import { useRouteController } from '../../hooks/useRouteController'
import { CitySvgEnum } from '@/features/city/enums/CitySvgEnum'
import { Route } from '@/shared/types/entities/Route'

/**
 * Componente de prueba para verificar que el controller funciona correctamente
 */
const RouteControllerTest: React.FC = () => {
  const {
    handleCreate,
    routes,
    loading,
    errors,
    handleGetAll
  } = useRouteController()

  const createTestRoute = () => {
    const testRoute: Route = {
      id: crypto.randomUUID(),
      origin: {
        name: ['Medellín', 'Bogotá', 'Cali'][Math.floor(Math.random() * 3)],
        color: '#FF6B6B',
        svgType: CitySvgEnum.Classic
      },
      destiny: {
        name: ['Cartagena', 'Barranquilla', 'Santa Marta'][Math.floor(Math.random() * 3)],
        color: '#4ECDC4',
        svgType: CitySvgEnum.Classic
      },
      cost: 150000,
      isDirectRoute: true,
      intermediateStops: [],
      color: '#2196F3'
    }

    handleCreate(testRoute, (newRoute: Route) => {
      console.log('Ruta creada exitosamente:', newRoute)
      alert('Ruta creada exitosamente')
    })
  }

  const loadAllRoutes = () => {
    handleGetAll()
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Test del Route Controller</h2>

      <div className="space-y-4">
        <div>
          <button
            onClick={createTestRoute}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Ruta de Prueba'}
          </button>
        </div>

        <div>
          <button
            onClick={loadAllRoutes}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Cargar Todas las Rutas'}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-semibold">Errores:</h3>
            <ul className="list-disc list-inside">
              {errors.map((error: string) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Rutas en Store ({routes.length})
          </h3>
          <div className="space-y-2">
            {routes.length === 0 ? (
              <p className="text-gray-500 italic">No hay rutas</p>
            ) : (
              routes.map((route: Route) => (
                <div
                  key={route.id}
                  className="p-3 border rounded-lg bg-gray-50"
                >
                  <div className="font-medium">
                    {route.origin?.name} → {route.destiny?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Costo: ${route.cost?.toLocaleString()} |
                    Tipo: {route.isDirectRoute ? 'Directa' : 'Indirecta'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteControllerTest
