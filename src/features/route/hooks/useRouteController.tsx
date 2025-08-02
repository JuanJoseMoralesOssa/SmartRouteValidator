import { useController } from "@/shared/hooks/useGenericController";
import useRouteStore from "../stores/useRouteStore";
import { Route } from "@/shared/types/entities/Route";
import { routeService } from "../services/RouteService";

export function useRouteController() {
  return useController<Route>(
    { color: '', cost: 0, destiny: { name: '', color: '' }, id: crypto.randomUUID(), isDirectRoute: false, origin: { name: '', color: '' }, intermediateStops: [] },
    routeService,
    useRouteStore,
    {
      validate: (route) =>
        route.origin?.name.trim() === ''
          ? ['El nombre de origen es requerido.']
          : []
    }
  );
}
