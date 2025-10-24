import { Route } from '@/shared/types/entities/Route'
import { createGenericStore } from '@/shared/stores/createGenericStore'
import { create } from 'zustand'
import { ID } from '@/shared/types/ID'

// Store genérico base para rutas
const useBaseRouteStore = createGenericStore<Route>()

// Interface para funcionalidades específicas de rutas
interface RouteSpecificState {
  highlightedRouteIds: Set<ID>
  addHighlightedRoute: (routeId: ID) => void
  removeHighlightedRoute: (routeId: ID) => void
  clearHighlightedRoutes: () => void
  toggleHighlightedRoute: (routeId: ID) => void
  getHighlightedRoutes: () => Route[]
  isRouteHighlighted: (routeId: ID) => boolean
}

// Store específico para funcionalidades adicionales de rutas
const useRouteSpecificStore = create<RouteSpecificState>((set, get) => ({
  highlightedRouteIds: new Set(),

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

/**
 * Hook simplificado para el store de rutas
 * Combina funcionalidades genéricas (CRUD) con específicas (highlighting)
 */
const useRouteStore = () => {
  const baseStore = useBaseRouteStore()

  // Suscribirse explícitamente al estado para reactividad
  const highlightedRouteIds = useRouteSpecificStore(state => state.highlightedRouteIds)
  const addHighlightedRoute = useRouteSpecificStore(state => state.addHighlightedRoute)
  const removeHighlightedRoute = useRouteSpecificStore(state => state.removeHighlightedRoute)
  const clearHighlightedRoutes = useRouteSpecificStore(state => state.clearHighlightedRoutes)
  const toggleHighlightedRoute = useRouteSpecificStore(state => state.toggleHighlightedRoute)
  const getHighlightedRoutes = useRouteSpecificStore(state => state.getHighlightedRoutes)
  const isRouteHighlighted = useRouteSpecificStore(state => state.isRouteHighlighted)

  // Override removeItem para también limpiar highlights
  const removeRoute = (id: ID) => {
    baseStore.removeItem(id)
    removeHighlightedRoute(id)
  }

  return {
    // Propiedades y métodos genéricos (CRUD)
    routes: baseStore.items,
    setRoutes: baseStore.setItems,
    addRoute: baseStore.addItem,
    updateRoute: baseStore.updateItem,
    removeRoute,

    route: baseStore.item,
    setRoute: baseStore.setItem,
    clearRoute: baseStore.clearItem,

    // Propiedades y métodos específicos (Highlighting)
    highlightedRouteIds,
    addHighlightedRoute,
    removeHighlightedRoute,
    clearHighlightedRoutes,
    toggleHighlightedRoute,
    getHighlightedRoutes,
    isRouteHighlighted,
  }
}

export default useRouteStore
