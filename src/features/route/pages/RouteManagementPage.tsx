import React from 'react'
import RouteVisualization from '../components/organisms/RouteVisualization'
import { useRoutePathBuilder } from '../hooks/useRoutePathBuilder'
import RoutePathBuilder from '../components/pages/RoutePathBuilder'
import RouteControllerTest from '../components/atoms/RouteControllerTest'

/**
 * Página ejemplo que combina la visualización de rutas con el constructor de caminos
 */
const RouteManagementPage: React.FC = () => {
  const { pathInfo } = useRoutePathBuilder()

  return (
    <div className="route-management-page">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Rutas y Caminos
          </h1>
          <p className="text-gray-600">
            Construye caminos visuales combinando múltiples rutas
          </p>
        </div>

        {/* Componente de prueba del controller */}
        <div className="mb-6">
          <RouteControllerTest />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel del constructor de caminos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <RoutePathBuilder />
            </div>
          </div>

          {/* Panel de visualización */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Visualización del Mapa
                </h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span>
                    📍 {pathInfo.cities.length} ciudades conectadas
                  </span>
                  <span>
                    🛣️ {pathInfo.totalRoutes} rutas en el camino
                  </span>
                  <span>
                    ⚡ {pathInfo.directRoutes} directas
                  </span>
                  <span>
                    🔄 {pathInfo.indirectRoutes} indirectas
                  </span>
                </div>
              </div>

              {/* Canvas de visualización */}
              <div className="border rounded-lg overflow-hidden">
                <RouteVisualization />
              </div>

              {/* Leyenda */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Rutas resaltadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Rutas disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Ciudades</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de información adicional */}
        {pathInfo.totalRoutes > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Información del Camino Actual
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {pathInfo.totalRoutes}
                </div>
                <div className="text-sm text-gray-500">Total de Rutas</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {pathInfo.directRoutes}
                </div>
                <div className="text-sm text-gray-500">Rutas Directas</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {pathInfo.indirectRoutes}
                </div>
                <div className="text-sm text-gray-500">Rutas Indirectas</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {pathInfo.cities.length}
                </div>
                <div className="text-sm text-gray-500">Ciudades</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RouteManagementPage
