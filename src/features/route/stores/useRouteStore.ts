import { Route } from '@/shared/types/entities/Route'
import { createGenericStore } from '@/shared/stores/createGenericStore'

const useRouteStore = createGenericStore<Route>('routeStore')
export default useRouteStore
