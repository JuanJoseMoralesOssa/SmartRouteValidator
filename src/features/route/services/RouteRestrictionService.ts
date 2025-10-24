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

/**
 * Callback para visualización en tiempo real
 */
export type VisualizationCallback = (routeId: ID, action: 'add' | 'clear' | 'remove' | 'explore') => Promise<void>;

export class RouteRestrictionService {
  private evaluatedRoute: Route = {} as Route;
  private costIndirectRoute: number = 0;
  private readonly visitedRoutes: Map<ID, ID> = new Map();
  private readonly routeRepository = routeRepository;
  private exploredRoutes: ID[] = [];
  private visualizationCallback?: VisualizationCallback;

  /**
   * Valida una ruta y retorna el resultado con las rutas exploradas
   */
  async validateRoute(
    route: Route | Partial<Route>,
    visualizationCallback?: VisualizationCallback
  ): Promise<ValidationResult> {
    // Reiniciar el estado para cada validación
    this.evaluatedRoute = route as Route;
    this.costIndirectRoute = 0;
    this.visitedRoutes.clear();
    this.exploredRoutes = [];
    this.visualizationCallback = visualizationCallback;

    console.log(`🔍 Validando ruta: ${route.origin?.name} → ${route.destiny?.name} (Costo: ${route.cost})`);

    // Limpiar visualización al inicio de TODA validación
    if (this.visualizationCallback) {
      console.log(`🧹 Pre-limpieza al inicio de validateRoute`);
      await this.visualizationCallback('' as ID, 'clear');
    }

    const hasViolation = await this.isGreaterOrEqualDirectRouteCost(route as Route);

    this.clearVisitedRoutes();

    console.log(`${hasViolation ? '❌' : '✅'} Validación ${hasViolation ? 'FALLIDA' : 'EXITOSA'}`);
    console.log(`📊 Rutas exploradas: ${this.exploredRoutes.length}`, this.exploredRoutes);

    return {
      isValid: !hasViolation,
      exploredRoutes: [...this.exploredRoutes],
      violationPath: hasViolation ? [...this.exploredRoutes] : undefined,
      errorMessage: hasViolation
        ? "The cost of the direct route is greater than or equal to the cost of the indirect routes."
        : undefined
    };
  }

  private async isGreaterOrEqualDirectRouteCost(route: Route): Promise<boolean> {
    console.log(`🎯 Iniciando isGreaterOrEqualDirectRouteCost`);

    const connections = this.getConnections().filter((r) => route.originId === r.originId);

    for (const connection of connections) {
      if (this.areValidIds(route, connection) && this.isIndirectRoute(connection.destinyId!, route.destinyId!)) {
        // Reiniciar el costo para esta nueva ruta indirecta
        this.costIndirectRoute = connection.cost;

        // Agregar la ruta al recorrido y notificar la visualización
        if (connection.id) {
          this.exploredRoutes.push(connection.id);
          if (this.visualizationCallback) {
            console.log(`  ➕ Resaltando ruta inicial: ${connection.id}`);
            await this.visualizationCallback(connection.id, 'add');
          }
        }

        if (await this.verifyRoute(connection.destinyId!)) {
          this.visitedRoutes.set(connection.id!, connection.id!);
          return true;
        }

        // Backtrack: esta ruta no funcionó, quitar el resaltado
        if (connection.id && this.visualizationCallback) {
          console.log(`  ➖ Quitando resaltado (backtrack): ${connection.id}`);
          await this.visualizationCallback(connection.id, 'remove');
          // Marcar como explorada (visitada pero descartada)
          console.log(`  🔍 Marcando como explorada: ${connection.id}`);
          await this.visualizationCallback(connection.id, 'explore');
        }

        // Limpiar rutas visitadas para el siguiente intento, pero mantener exploredRoutes
        this.clearVisitedRoutes();
      }
    }
    return false;
  }

  private isIndirectRoute(routeID: ID, destinyId: ID): boolean {
    return routeID !== destinyId;
  }

  private areValidRouteIds(route: Route): boolean {
    return !!(route.originId && route.destinyId && route.originId !== route.destinyId);
  }

  private areValidIds(route: Route, routeToFilter: Route): boolean {
    return this.areValidRouteIds(route) && this.areValidRouteIds(routeToFilter);
  }

  private getConnections(): Route[] {
    return this.routeRepository.getAllData();
  }

  private isNotVisited(route: Route): boolean {
    return !this.visitedRoutes.has(route.id!);
  }

  private async verifyRoute(originId: ID): Promise<boolean> {
    const connections = this.getConnections().filter(route => route.originId === originId && this.isNotVisited(route));

    for (const connection of connections) {
      // Agregar la ruta al recorrido (para visualización) y notificar
      if (connection.id) {
        this.exploredRoutes.push(connection.id);
        if (this.visualizationCallback) {
          console.log(`  ➕ Resaltando ruta: ${connection.id}`);
          await this.visualizationCallback(connection.id, 'add');
        }
      }

      // Actualizar costo acumulado
      this.costIndirectRoute += connection.cost;
      this.visitedRoutes.set(connection.id!, connection.id!);

      const isDestiny = connection.destinyId === this.evaluatedRoute.destinyId;
      const isCostInvalid = this.costIndirectRoute <= this.evaluatedRoute.cost;

      // Si llegamos al destino, verificar si el costo viola la restricción
      if (isDestiny) {
        return isCostInvalid;
      }

      // Continuar explorando recursivamente
      if (await this.verifyRoute(connection.destinyId!)) {
        return true;
      }

      // Backtrack: esta ruta no funcionó, quitar el resaltado
      if (connection.id && this.visualizationCallback) {
        console.log(`  ➖ Quitando resaltado (backtrack): ${connection.id}`);
        await this.visualizationCallback(connection.id, 'remove');
        // Marcar como explorada (visitada pero descartada)
        console.log(`  🔍 Marcando como explorada: ${connection.id}`);
        await this.visualizationCallback(connection.id, 'explore');
      }

      // Backtrack: revertir el costo pero mantener la ruta en exploredRoutes (para visualización)
      this.costIndirectRoute -= connection.cost;
      // NO remover de visitedRoutes aquí para evitar ciclos infinitos
    }
    return false;
  }

  private clearVisitedRoutes(): void {
    this.visitedRoutes.clear();
  }
}

export const routeRestrictionService = new RouteRestrictionService()
