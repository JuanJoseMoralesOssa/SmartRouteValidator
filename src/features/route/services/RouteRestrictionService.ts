import { Route } from "@/shared/types/entities/Route";
import { ID } from "@/shared/types/ID";
import { routeRepository } from "../repositories/RouteRepository";

export class RouteRestrictionService {

  evaluatedRoute: Route;
  costIndirectRoute: number;
  visitedRoutes: Map<ID, ID>;
  routeRepository: typeof routeRepository;

  constructor() {
    this.evaluatedRoute = {} as Route;
    this.costIndirectRoute = 0;
    this.visitedRoutes = new Map<ID, ID>();
    this.routeRepository = routeRepository;
  }

  validateRoute(route: Route | Partial<Route>): void {
    this.evaluatedRoute = route as Route;
    if (this.isGreaterOrEqualDirectRouteCost(route as Route)) {
      throw new Error("The cost of the direct route is greater than or equal to the cost of the indirect routes.");
    }
  }

  isGreaterOrEqualDirectRouteCost(route: Route): boolean {
    const connections = this.getConnections().filter((r) => route.originId === r.originId);
    for (const connection of connections) {
      if (
        this.areValidIds(route, connection) &&
        this.isIndirectRoute(connection.destinyId!, route.destinyId!)
      ) {
        this.costIndirectRoute = connection.cost;
        if (this.verifyRoute(connection.destinyId!)) {
          const firstRoute = connection;
          this.visitedRoutes.set(firstRoute.id!, firstRoute.id!);
          return true;
        }
        this.clearVisitedRoutes();
      }
    }
    return false;
  }

  isIndirectRoute(routeID: ID, destinyId: ID): boolean {
    return routeID !== destinyId;
  }

  areValidRouteIds(route: Route): boolean {
    return (route.originId !== undefined && route.destinyId !== undefined) ||
      (route.originId !== null && route.destinyId !== null) ||
      (route.originId !== "" && route.destinyId !== "") ||
      (route.originId !== 0 && route.destinyId !== 0) ||
      (Number.isInteger(route.originId) && Number.isInteger(route.destinyId)) ||
      (route.originId !== undefined && route.destinyId !== undefined && route.originId !== route.destinyId) ||
      (route.originId !== undefined && route.destinyId !== undefined && Number(route.originId) > 0 && Number(route.destinyId) > 0)
      ;
  }

  areValidIds(route: Route, routeToFilter: Route): boolean {
    return this.areValidRouteIds(route) && this.areValidRouteIds(routeToFilter);
  }


  getConnections(): Route[] {
    return this.routeRepository.getAllData()
  }

  isNotVisited(route: Route): boolean {
    return !this.visitedRoutes.has(route.id!);
  }

  verifyRoute(originId: ID): boolean {
    const connections = this.getConnections().filter(route => route.originId === originId && this.isNotVisited(route));
    for (const connection of connections) {
      this.costIndirectRoute += connection.cost;
      this.visitedRoutes.set(connection.id!, connection.id!);
      const roadWithAllIndirectRoutesToDestiny = connection.destinyId === this.evaluatedRoute.destinyId
      const isCostInvalid = this.costIndirectRoute <= this.evaluatedRoute.cost
      if (
        roadWithAllIndirectRoutesToDestiny
      ) {
        if (isCostInvalid) {
          return true
        } else {
          return false
        }
      }
      if (this.verifyRoute(connection.destinyId!)) {
        return true;
      }
      this.costIndirectRoute -= connection.cost;
    }
    return false;
  }

  clearVisitedRoutes(): void {
    this.visitedRoutes.clear();
  }

}

export const routeRestrictionService = new RouteRestrictionService()
