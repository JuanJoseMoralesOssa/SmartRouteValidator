import { DictionaryRepository } from "@/shared/repositories/repository";
import { Route } from "@/shared/types/entities/Route";

export class RouteRepository extends DictionaryRepository<Route> {

}

export const routeRepository = new RouteRepository()
