import { Route } from '@/shared/types/entities/Route'
import { createGenericStore } from '@/shared/stores/createGenericStore'
import { create } from 'zustand'
import { ID } from '@/shared/types/ID'

// Store genérico base para rutas
const useBaseRouteStore = createGenericStore<Route>()

// Interface para funcionalidades específicas de rutas
interface RouteSpecificState {
  // IDs de rutas resaltadas para formar el camino
  highlightedRouteIds: Set<ID>

  // Acciones para manejar rutas resaltadas (camino)
  addHighlightedRoute: (routeId: ID) => void
  removeHighlightedRoute: (routeId: ID) => void
  clearHighlightedRoutes: () => void
  toggleHighlightedRoute: (routeId: ID) => void

  // Getters específicos
  getHighlightedRoutes: () => Route[]
  isRouteHighlighted: (routeId: ID) => boolean
}

// Store específico para funcionalidades adicionales de rutas
const useRouteSpecificStore = create<RouteSpecificState>((set, get) => ({
  highlightedRouteIds: new Set(),

  // Acciones para rutas resaltadas
  addHighlightedRoute: (routeId) => set((state) => ({
    highlightedRouteIds: new Set([...state.highlightedRouteIds, routeId])
  })),

  removeHighlightedRoute: (routeId) => set((state) => {
    const newSet = new Set(state.highlightedRouteIds)
    newSet.delete(routeId)
    return { highlightedRouteIds: newSet }
  }),

  clearHighlightedRoutes: () => set({ highlightedRouteIds: new Set() }),

  toggleHighlightedRoute: (routeId) => set((state) => {
    const newSet = new Set(state.highlightedRouteIds)
    if (newSet.has(routeId)) {
      newSet.delete(routeId)
    } else {
      newSet.add(routeId)
    }
    return { highlightedRouteIds: newSet }
  }),

  // Getters
  getHighlightedRoutes: () => {
    const baseStore = useBaseRouteStore.getState()
    const { highlightedRouteIds } = get()
    return baseStore.items.filter(route => route.id && highlightedRouteIds.has(route.id))
  },

  isRouteHighlighted: (routeId) => {
    const { highlightedRouteIds } = get()
    return highlightedRouteIds.has(routeId)
  }
}))

// Hook combinado que expone tanto funcionalidades genéricas como específicas
const useRouteStore = () => {
  const baseStore = useBaseRouteStore()
  const specificStore = useRouteSpecificStore()

  // Override removeItem para también limpiar highlights
  const removeItem = (id: ID) => {
    baseStore.removeItem(id)
    specificStore.removeHighlightedRoute(id)
  }

  return {
    // Propiedades y métodos genéricos (renombrados para compatibilidad)
    routes: baseStore.items,
    setRoutes: baseStore.setItems,
    addRoute: baseStore.addItem,
    updateRoute: baseStore.updateItem,
    removeRoute: removeItem,

    route: baseStore.item,
    setRoute: baseStore.setItem,
    clearRoute: baseStore.clearItem,

    // Propiedades y métodos específicos de rutas
    ...specificStore
  }
}

export default useRouteStore
