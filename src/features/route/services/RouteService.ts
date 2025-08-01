import { Service } from "@/shared/services/service";
import { routeRepository } from "../repositories/RouteRepository";
import { Route } from "@/shared/types/entities/Route";

export class RouteService extends Service<Route> {
}

export const routeService = new RouteService(routeRepository)
