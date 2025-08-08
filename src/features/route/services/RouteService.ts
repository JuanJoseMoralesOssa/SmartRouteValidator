import { Service } from "@/shared/services/service";
import { Route } from "@/shared/types/entities/Route";
import { routeRepository } from "../repositories/RouteRepository";
import { DataObject } from "@/shared/types/DataObject";
import { ID } from "@/shared/types/ID";
import { routeRestrictionService } from "./RouteRestrictionService";

export class RouteService extends Service<Route> {

  public create(data: DataObject<Route>): Route {
    routeRestrictionService.validateRoute(data);
    return super.create(data);
  }

  public updateById(id: ID, data: DataObject<Route>): Promise<void> {
    routeRestrictionService.validateRoute(data);
    return super.updateById(id, data);
  }
}
export const routeService = new RouteService(routeRepository)
