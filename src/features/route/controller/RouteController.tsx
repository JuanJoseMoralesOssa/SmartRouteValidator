import { routeService } from "@/features/route/services/RouteService";
import { useController } from "@/shared/hooks/useGenericController";
import { Route } from "@/shared/types/entities/Route";
import useRouteStore from "../stores/useRouteStore";


export function useRouteController() {
  const { routes, setRoutes } = useRouteStore();
  return useController<Route>(
    { color: '', cost: 0, destiny: { name: '', color: '' }, id: crypto.randomUUID(), isDirectRoute: false, origin: { name: '', color: '' }, intermediateStops: [] },
    routeService,
    routes,
    setRoutes,
    {
      validate: (route) =>
        route.origin.name.trim() === ''
          ? ['El nombre de origen es requerido.']
          : []
    }
  );
}
