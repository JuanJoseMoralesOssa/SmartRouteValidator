import { Route } from '@/shared/types/entities/Route'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface RouteStore {
    routeCreate: Route | null
    setRouteCreate: (route: Route) => void
    removeRouteCreate: () => void
    routeEdit: Route | null
    setRouteEdit: (route: Route) => void
    removeRouteEdit: () => void
    routes: Route[] | null
    setRoutes: (routes: Route[]) => void
    removeRoutes: () => void
}

const useRouteStore = create<RouteStore>()(
    persist(
        (set) => ({
            routeCreate: null,
            setRouteCreate: (route: Route) => set({ routeCreate: route }),
            removeRouteCreate: () => set({ routeCreate: null }),
            routeEdit: null,
            setRouteEdit: (route: Route) => set({ routeEdit: route }),
            removeRouteEdit: () => set({ routeEdit: null }),
            routes: [],
            setRoutes: (routes: Route[]) => set({ routes }),
            removeRoutes: () => set({ routes: null }),
        }),
        {
            name: 'routeStore',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

export default useRouteStore
