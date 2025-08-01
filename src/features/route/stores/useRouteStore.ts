import { Route } from '@/shared/types/entities/Route'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface RouteStore {
    route: Route | null
    setRoute: (route: Route) => void
    removeRoute: () => void
    routes: Route[] | null
    setRoutes: (routes: Route[]) => void
    removeRoutes: () => void
}

const useRouteStore = create<RouteStore>()(
    persist(
        (set) => ({
            route: null,
            setRoute: (route: Route) => set({ route }),
            removeRoute: () => set({ route: null }),
            routes: null,
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
