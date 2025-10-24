import { Route } from "@/shared/types/entities/Route";
import { ID } from "@/shared/types/ID";
import { routeRepository } from "../repositories/RouteRepository";

/**
 * Resultado de la validación de una ruta
 */
export interface ValidationResult {
  isValid: boolean;
  exploredRoutes: ID[]; // Rutas exploradas durante la validación (para visualización)
  violationPath?: ID[]; // Camino que viola la restricción (si existe)
  errorMessage?: string;
}

export class RouteRestrictionService {

  evaluatedRoute: Route;
  costIndirectRoute: number;
  visitedRoutes: Map<ID, ID>;
  routeRepository: typeof routeRepository;
  exploredRoutes: ID[]; // Registrar rutas exploradas

  constructor() {
    this.evaluatedRoute = {} as Route;
    this.costIndirectRoute = 0;
    this.visitedRoutes = new Map<ID, ID>();
    this.routeRepository = routeRepository;
    this.exploredRoutes = [];
  }

  /**
   * Valida una ruta y retorna el resultado con las rutas exploradas
   */
  async validateRoute(route: Route | Partial<Route>): Promise<ValidationResult> {
    this.evaluatedRoute = route as Route;
    this.visitedRoutes.clear();
    this.exploredRoutes = []; // Limpiar rutas exploradas

    const hasViolation = await this.isGreaterOrEqualDirectRouteCost(route as Route);

    this.clearVisitedRoutes();

    return {
      isValid: !hasViolation,
      exploredRoutes: [...this.exploredRoutes],
      violationPath: hasViolation ? [...this.exploredRoutes] : undefined,
      errorMessage: hasViolation
        ? "The cost of the direct route is greater than or equal to the cost of the indirect routes."
        : undefined
    };
  }

  async isGreaterOrEqualDirectRouteCost(route: Route): Promise<boolean> {
    const connections = this.getConnections().filter((r) => route.originId === r.originId);
    for (const connection of connections) {
      if (
        this.areValidIds(route, connection) &&
        this.isIndirectRoute(connection.destinyId!, route.destinyId!)
      ) {
        this.costIndirectRoute = connection.cost;

        // Registrar la ruta que estamos explorando (para visualización)
        if (connection.id) {
          this.exploredRoutes.push(connection.id);
        }

        if (await this.verifyRoute(connection.destinyId!)) {
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

  async verifyRoute(originId: ID): Promise<boolean> {
    const connections = this.getConnections().filter(route => route.originId === originId && this.isNotVisited(route));
    for (const connection of connections) {

      // Registrar la ruta que estamos explorando (para visualización)
      if (connection.id) {
        this.exploredRoutes.push(connection.id);
      }

      this.costIndirectRoute += connection.cost;
      this.visitedRoutes.set(connection.id!, connection.id!);
      const roadWithAllIndirectRoutesToDestiny = connection.destinyId === this.evaluatedRoute.destinyId
      const isCostInvalid = this.costIndirectRoute <= this.evaluatedRoute.cost

      if (roadWithAllIndirectRoutesToDestiny) {
        if (isCostInvalid) {
          return true
        } else {
          return false
        }
      }

      if (await this.verifyRoute(connection.destinyId!)) {
        return true;
      }

      // Backtrack
      this.costIndirectRoute -= connection.cost;
    }
    return false;
  }

  clearVisitedRoutes(): void {
    this.visitedRoutes.clear();
  }

}

export const routeRestrictionService = new RouteRestrictionService()
