// import { CityRepository } from '@/features/city/repositories/CityRepository'
// import { RouteRepository } from '@/features/route/repositories/RouteRepository'
// import { DictionaryRepository } from '@/shared/repositories/repository'
// import { City } from '@/shared/types/entities/City'
// import { Route } from '@/shared/types/entities/Route'
// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'

// export interface StoreSession {
//   routeRepository: DictionaryRepository<Route>
//   setRouteRepository: (repository: DictionaryRepository<Route>) => void
//   // removeRouteRepository: () => void
//   cityRepository: DictionaryRepository<City>
//   setCityRepository: (cityRepository: DictionaryRepository<City>) => void
//   // removeCityRepository: () => void
// }

// export const storeSession = create<StoreSession>()(
//   persist(
//     (set) => ({
//       routeRepository: new RouteRepository(),
//       setRouteRepository: (routeRepository: DictionaryRepository<Route>) => set({ routeRepository }),
//       // removeRouteRepository: () => set({ routeRepository: null }),
//       cityRepository: new CityRepository(),
//       setCityRepository: (cityRepository: DictionaryRepository<City>) => set({ cityRepository }),
//       // removeCityRepository: () => set({ cityRepository: null })
//     }),
//     {
//       name: 'StoreSession',
//       storage: createJSONStorage(() => sessionStorage),
//     }
//   )
// )
