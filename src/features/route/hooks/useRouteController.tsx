import { useState } from "react";
import useRouteStore from "../stores/useRouteStore";
import { Route } from "@/shared/types/entities/Route";
import { routeService } from "../services/RouteService";
import { mockRoutes } from "@/shared/types/mocks/MockRoutes";
import { useToast } from "@/shared/hooks/toast/useToast";
import { useConfirm } from "@/shared/hooks/toast/useConfirm";
import { ID } from "@/shared/types/ID";

interface UseRouteControllerOptions {
  validate?: (route: Route | Partial<Route>) => string[];
  onError?: (error: string) => void;
  enableVisualization?: boolean;
  visualizationDelay?: number;
}

const DEFAULT_VALIDATION_DELAY = 500;

/**
 * Hook simplificado para manejar rutas con visualización opcional
 */
export function useRouteController(options?: UseRouteControllerOptions) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const store = useRouteStore();
  const toast = useToast();
  const confirm = useConfirm();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Callback de visualización en tiempo real
  const createVisualizationCallback = () => {
    if (!options?.enableVisualization) return undefined;

    const delay = options.visualizationDelay || DEFAULT_VALIDATION_DELAY;

    return async (routeId: ID, action: 'add' | 'clear' | 'remove' | 'explore') => {
      if (action === 'clear') {
        store.clearHighlightedRoutes();
        store.clearExploredRoutes();
        // Pequeño delay para asegurar que la UI se actualice
        await sleep(100);
        return;
      }

      if (action === 'explore') {
        // Marcar como explorada (visitada pero descartada por backtracking)
        store.addExploredRoute(routeId);
        await sleep(delay / 2); // Delay más corto para exploradas
        return;
      }

      if (action === 'remove') {
        store.removeHighlightedRoute(routeId);
        await sleep(delay);
        return;
      }

      // action === 'add'
      // Verificar en el store si ya está resaltada (para evitar duplicados visuales)
      if (store.isRouteHighlighted(routeId)) {
        return;
      }

      store.addHighlightedRoute(routeId);
      await sleep(delay);
    };
  };

  // Validación básica
  const validateRoute = (routeToValidate: Route | Partial<Route>): boolean => {
    const defaultValidation = (route: Route | Partial<Route>) => {
      const errors: string[] = [];
      if (!route.origin?.name?.trim()) errors.push('Name is required for origin.');
      if (!route.destiny?.name?.trim()) errors.push('Name is required for destination.');
      return errors;
    };

    const validationErrors = options?.validate?.(routeToValidate) ?? defaultValidation(routeToValidate);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      options?.onError?.(validationErrors.join(', '));
      return false;
    }

    setErrors([]);
    return true;
  };

  // Crear nueva ruta con visualización en tiempo real en tiempo real
  const handleCreate = async (routeData: Route, onSuccess?: (newRoute: Route) => void) => {
    if (!validateRoute(routeData)) return;

    setLoading(true);

    try {
      const visualizationCallback = createVisualizationCallback();

      const { route: newRoute, validation } = await routeService.createWithValidation(
        routeData,
        visualizationCallback
      );

      store.addRoute(newRoute);

      // Mantener visible el resultado final por un momento si hay visualización
      if (options?.enableVisualization && validation.exploredRoutes.length > 0) {
        await sleep(2000);
      }

      // SIEMPRE limpiar las rutas resaltadas al finalizar
      store.clearHighlightedRoutes();
      store.clearExploredRoutes();

      setErrors([]);
      onSuccess?.(newRoute);
      toast.success('Saved successfully');

    } catch (error) {
      console.error('Error creating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
      toast.error(errorMessage);
      // Limpiar rutas resaltadas en caso de error
      store.clearHighlightedRoutes();
      store.clearExploredRoutes();
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ruta existente con visualización en tiempo real
  const handleUpdate = async (routeData: Partial<Route>, onSuccess?: (updatedRoute: Route) => void) => {
    const id = routeData.id;
    if (!id) {
      const errorMsg = 'ID route is required for update.';
      setErrors([errorMsg]);
      options?.onError?.(errorMsg);
      return;
    }

    if (!validateRoute(routeData)) return;

    setLoading(true);

    try {
      const visualizationCallback = createVisualizationCallback();

      const validation = await routeService.updateWithValidation(
        id,
        routeData,
        visualizationCallback
      );

      store.updateRoute(id, routeData);

      // Mantener visible el resultado final por un momento si hay visualización
      if (options?.enableVisualization && validation.exploredRoutes.length > 0) {
        await sleep(2000);
      }

      // SIEMPRE limpiar las rutas resaltadas al finalizar
      store.clearHighlightedRoutes();
      store.clearExploredRoutes();

      const updatedRoute = store.routes.find(r => r.id === id);
      if (updatedRoute) onSuccess?.(updatedRoute);

      setErrors([]);
      toast.success('Updated successfully');

    } catch (error) {
      console.error('Error updating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
      toast.error(errorMessage);
      // Limpiar rutas resaltadas en caso de error
      store.clearHighlightedRoutes();
      store.clearExploredRoutes();
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ruta
  const handleDelete = async (id: string | number, onSuccess?: () => void) => {
    try {
      setLoading(true);
      await routeService.deleteById(id);
      store.removeRoute(id);

      onSuccess?.();

      confirm(
        'Delete route',
        'Are you sure you want to delete this record?',
      );

    } catch (error) {
      console.error('Error deleting route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las rutas
  const handleGetAll = () => {
    try {
      setLoading(true);
      const routes = routeService.getAll();
      store.setRoutes(routes);
      return routes;
    } catch (error) {
      console.error('Error getting all routes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener ruta por ID
  const handleGetById = async (id: string | number) => {
    try {
      return await routeService.findById(id);
    } catch (error) {
      console.error('Error getting route by id:', error);
      return null;
    }
  };

  // Cargar ejemplos con visualización en tiempo real
  const loadExample = async () => {
    setLoading(true);

    try {
      // Eliminar todas las rutas existentes
      for (const route of store.routes) {
        if (route.id) await routeService.deleteById(route.id);
      }

      // Limpiar estado inicial
      store.setRoutes([]);
      store.clearHighlightedRoutes();
      store.clearExploredRoutes();


      // Crear las rutas de ejemplo de forma secuencial
      for (const route of mockRoutes) {
        if (!validateRoute(route)) continue;

        const visualizationCallback = createVisualizationCallback();

        const { route: newRoute, validation } = await routeService.createWithValidation(
          route,
          visualizationCallback
        );

        store.addRoute(newRoute);

        // Mantener visible el resultado final por un momento si hay visualización
        if (options?.enableVisualization && validation.exploredRoutes.length > 0) {
          await sleep(1000);
        }

        // Limpiar después de cada ejemplo
        store.clearHighlightedRoutes();
        store.clearExploredRoutes();
      }

      // Agregar todas las rutas de una vez

      toast.success('Examples loaded successfully');
      setErrors([]);

    } catch (error) {
      console.error('Error loading examples:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error loading examples';
      setErrors([errorMessage]);
      toast.error(errorMessage);
      // Limpiar rutas resaltadas en caso de error
      store.clearHighlightedRoutes();
      store.clearExploredRoutes();
    } finally {
      setLoading(false);
    }
  }; return {
    // Estado
    loading,
    errors,

    // Acciones
    handleCreate,
    handleUpdate,
    handleDelete,
    handleGetAll,
    handleGetById,

    // Store data
    routes: store.routes,
    setRoutes: store.setRoutes,
    highlightedRoutes: store.getHighlightedRoutes(),
    exploredRoutes: store.getExploredRoutes(),

    route: store.route,
    setRoute: store.setRoute,

    // Highlighting actions
    addHighlightedRoute: store.addHighlightedRoute,
    removeHighlightedRoute: store.removeHighlightedRoute,
    toggleHighlightedRoute: store.toggleHighlightedRoute,
    clearHighlightedRoutes: store.clearHighlightedRoutes,
    isRouteHighlighted: store.isRouteHighlighted,

    // Explored routes actions
    addExploredRoute: store.addExploredRoute,
    removeExploredRoute: store.removeExploredRoute,
    clearExploredRoutes: store.clearExploredRoutes,
    isRouteExplored: store.isRouteExplored,

    loadExample,
  };
}
