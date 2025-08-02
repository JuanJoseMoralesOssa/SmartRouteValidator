import { DEFAULTCITY } from '@constants/cts'
import { Route } from '@/shared/types/entities/Route'

export function getInitialRouteData(initialData?: Partial<Route>): Partial<Route> {
  return (
    initialData || {
      origin: DEFAULTCITY,
      destiny: DEFAULTCITY,
      cost: 0,
      isDirectRoute: true,
      intermediateStops: [],
    }
  )
}

export function validateRouteForm(origin: string, destiny: string, cost: string): string | null {
  if (!origin || !destiny || !cost) {
    return 'Los campos de la ciudad de origen, el destino y el costo son requeridos'
  }
  return null
}
