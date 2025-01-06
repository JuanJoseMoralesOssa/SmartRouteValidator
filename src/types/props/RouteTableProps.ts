import { Route } from '../Route'

export interface RoutesTableProps {
    routes: Route[]
    onEditRoute: (route: Route) => void
    onDeleteRoute: (routeId: string) => void
}
