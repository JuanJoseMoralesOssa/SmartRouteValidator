import { useMemo } from 'react'
import useRouteStore from '../stores/useRouteStore'

/**
 * Hook especializado para construcción y manejo de caminos (paths) con múltiples rutas
 */
export const useRoutePathBuilder = () => {
  const store = useRouteStore()

  const { routes, highlightedRouteIds, isRouteHighlighted, getHighlightedRoutes } = store

  // Memoizar rutas disponibles para optimizar rendimiento
  const availableRoutes = useMemo(() =>
    routes.filter(route =>
      route.id && !isRouteHighlighted(route.id)
    ),
    [routes, highlightedRouteIds, isRouteHighlighted]
  )

  // Memoizar rutas resaltadas
  const highlightedRoutes = useMemo(() =>
    getHighlightedRoutes(),
    [routes, highlightedRouteIds, getHighlightedRoutes]
  )

  // Funciones de utilidad para construcción de caminos
  const pathBuilder = {
    // Agregar ruta al camino
    addToPath: (routeId: string | number) => {
      const route = store.routes.find(r => r.id === routeId)
      if (route && !store.isRouteHighlighted(routeId)) {
        store.addHighlightedRoute(routeId)
        return true
      }
      return false
    },        // Remover ruta del camino
    removeFromPath: (routeId: string | number) => {
      store.removeHighlightedRoute(routeId)
    },

    // Alternar ruta en el camino
    toggleInPath: (routeId: string | number) => {
      store.toggleHighlightedRoute(routeId)
    },

    // Limpiar todo el camino
    clearPath: () => {
      store.clearHighlightedRoutes()
    },

    // Construir camino desde array de IDs
    buildPathFromIds: (routeIds: (string | number)[]) => {
      store.clearHighlightedRoutes()
      routeIds.forEach(id => {
        if (store.routes.find(route => route.id === id)) {
          store.addHighlightedRoute(id)
        }
      })
    },

    // Validar si una ruta puede ser agregada
    canAddRoute: (routeId: string | number) => {
      const route = store.routes.find(r => r.id === routeId)
      return route && !store.isRouteHighlighted(routeId)
    },

    // Obtener información del camino actual
    getPathInfo: () => ({
      totalRoutes: highlightedRoutes.length,
      cities: Array.from(new Set([
        ...highlightedRoutes.map(r => r.origin?.name),
        ...highlightedRoutes.map(r => r.destiny?.name)
      ].filter(Boolean))),
      routeIds: Array.from(store.highlightedRouteIds)
    }),

    // Validar conectividad del camino
    validatePathConnectivity: () => {
      if (highlightedRoutes.length <= 1) return true

      // Lógica básica de validación de conectividad
      // Puedes expandir esto según tus reglas de negocio
      const cities = new Set<string>()
      highlightedRoutes.forEach(route => {
        if (route.origin?.name) cities.add(route.origin.name)
        if (route.destiny?.name) cities.add(route.destiny.name)
      })

      return cities.size >= highlightedRoutes.length + 1
    }
  }

  return {
    // Estado del store
    routes: store.routes,
    highlightedRouteIds: store.highlightedRouteIds,

    // Datos procesados
    availableRoutes,
    highlightedRoutes,

    // Acciones del path builder
    ...pathBuilder,

    // Acciones básicas del store (para compatibilidad)
    setRoutes: store.setRoutes,
    addRoute: store.addRoute,
    updateRoute: store.updateRoute,
    removeRoute: store.removeRoute,

    // Getters útiles
    isRouteHighlighted: store.isRouteHighlighted,
    hasHighlightedRoutes: () => store.highlightedRouteIds.size > 0,
    getAvailableRoutesCount: () => availableRoutes.length,
    getHighlightedRoutesCount: () => highlightedRoutes.length,

    // Estado de validación
    isPathValid: pathBuilder.validatePathConnectivity(),
    pathInfo: pathBuilder.getPathInfo()
  }
}
