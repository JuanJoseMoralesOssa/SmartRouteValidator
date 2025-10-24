import { Service } from "@/shared/services/service";
import { Route } from "@/shared/types/entities/Route";
import { routeRepository } from "../repositories/RouteRepository";
import { DataObject } from "@/shared/types/DataObject";
import { ID } from "@/shared/types/ID";
import { routeRestrictionService, ValidationResult, VisualizationCallback } from "./RouteRestrictionService";

export class RouteService extends Service<Route> {

  /**
   * Valida y crea una ruta, retornando el resultado de la validación
   */
  public async createWithValidation(
    data: DataObject<Route>,
    visualizationCallback?: VisualizationCallback
  ): Promise<{ route: Route; validation: ValidationResult }> {
    const validation = await routeRestrictionService.validateRoute(data, visualizationCallback);

    if (!validation.isValid) {
      throw new Error(validation.errorMessage || "Route validation failed");
    }

    const route = super.create(data);
    return { route, validation };
  }  /**
   * Valida y actualiza una ruta
   */
  public async updateWithValidation(
    id: ID,
    data: DataObject<Route>,
    visualizationCallback?: VisualizationCallback
  ): Promise<ValidationResult> {
    const validation = await routeRestrictionService.validateRoute(data, visualizationCallback);

    if (!validation.isValid) {
      throw new Error(validation.errorMessage || "Route validation failed");
    }

    await super.updateById(id, data);
    return validation;
  }
}

export const routeService = new RouteService(routeRepository)
