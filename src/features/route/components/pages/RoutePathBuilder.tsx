import { useState } from 'react'
import useRouteStore from '../../stores/useRouteStore'
import RouteVisualization from '../organisms/RouteVisualization'

/**
 * Componente de ejemplo que demuestra cómo usar el sistema de rutas resaltadas múltiples
 */
const RoutePathBuilder = () => {
  const {
    routes,
    highlightedRouteIds,
    addHighlightedRoute,
    removeHighlightedRoute,
    clearHighlightedRoutes,
    toggleHighlightedRoute,
    getHighlightedRoutes,
    isRouteHighlighted
  } = useRouteStore()

  const [selectedRouteId, setSelectedRouteId] = useState<string>('')

  const handleAddRoute = () => {
    if (selectedRouteId && !isRouteHighlighted(selectedRouteId)) {
      addHighlightedRoute(selectedRouteId)
      setSelectedRouteId('')
    }
  }

  const handleRemoveRoute = (routeId: string | number) => {
    removeHighlightedRoute(routeId)
  }

  const handleToggleRoute = (routeId: string | number) => {
    toggleHighlightedRoute(routeId)
  }

  const handleClearPath = () => {
    clearHighlightedRoutes()
  }

  const highlightedRoutes = getHighlightedRoutes()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Constructor de Caminos</h1>

      {/* Visualización */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Visualización del Camino</h2>
        <RouteVisualization />
      </div>

      {/* Panel de control */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Agregar rutas al camino */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Agregar Ruta al Camino</h3>

          <div className="flex gap-2 mb-4">
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar ruta...</option>
              {routes
                .filter(route => route.id && !isRouteHighlighted(route.id))
                .map(route => (
                  <option key={route.id} value={route.id}>
                    {route.origin?.name} → {route.destiny?.name}
                    {route.isDirectRoute ? ' (Directa)' : ' (Indirecta)'}
                  </option>
                ))
              }
            </select>
            <button
              onClick={handleAddRoute}
              disabled={!selectedRouteId}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Agregar
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Rutas disponibles:</strong> {routes.length - highlightedRouteIds.size}</p>
            <p><strong>Rutas en el camino:</strong> {highlightedRouteIds.size}</p>
          </div>
        </div>

        {/* Rutas actuales en el camino */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Camino Actual</h3>
            <button
              onClick={handleClearPath}
              disabled={highlightedRouteIds.size === 0}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Limpiar Todo
            </button>
          </div>

          {highlightedRoutes.length > 0 ? (
            <div className="space-y-2">
              {highlightedRoutes.map((route, index) => (
                <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      {index + 1}. {route.origin?.name} → {route.destiny?.name}
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${route.isDirectRoute
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                      }`}>
                      {route.isDirectRoute ? 'Directa' : 'Indirecta'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleRoute(route.id!)}
                      className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors"
                      title="Alternar resaltado"
                    >
                      ↻
                    </button>
                    <button
                      onClick={() => handleRemoveRoute(route.id!)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                      title="Remover del camino"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay rutas en el camino actual
            </p>
          )}
        </div>
      </div>

      {/* Lista de todas las rutas disponibles */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Todas las Rutas Disponibles</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {routes.map(route => {
            const isHighlighted = route.id && isRouteHighlighted(route.id)
            return (
              <div
                key={route.id}
                className={`p-3 rounded-md cursor-pointer transition-all ${isHighlighted
                    ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                onClick={() => route.id && handleToggleRoute(route.id)}
              >
                <div className="font-medium text-gray-800">
                  {route.origin?.name} → {route.destiny?.name}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${route.isDirectRoute
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                    }`}>
                    {route.isDirectRoute ? 'Directa' : 'Indirecta'}
                  </span>
                  {isHighlighted && (
                    <span className="text-blue-600 font-bold">✓</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RoutePathBuilder
