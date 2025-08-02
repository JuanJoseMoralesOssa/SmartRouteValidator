import { Service } from "@/shared/services/service";
import { Route } from "@/shared/types/entities/Route";
import { routeRepository } from "../repositories/RouteRepository";

export class RouteService extends Service<Route> {
}
export const routeService = new RouteService(routeRepository)
