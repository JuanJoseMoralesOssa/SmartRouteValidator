import { useState } from "react";
import useRouteStore from "../stores/useRouteStore";
import { Route } from "@/shared/types/entities/Route";
import { routeService } from "../services/RouteService";
import { mockRoutes } from "@/shared/types/mocks/MockRoutes";

interface UseRouteControllerOptions {
  validate?: (route: Route | Partial<Route>) => string[];
  onError?: (error: string) => void;
}

export function useRouteController(options?: UseRouteControllerOptions) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const store = useRouteStore();

  // Validación
  const validateRoute = (routeToValidate: Route | Partial<Route>): boolean => {
    const defaultValidation = (route: Route | Partial<Route>) => {
      if (!route.origin?.name || route.origin.name.trim() === '') {
        return ['El nombre de origen es requerido.'];
      }
      if (!route.destiny?.name || route.destiny.name.trim() === '') {
        return ['El nombre de destino es requerido.'];
      }
      return [];
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

  // Crear nueva ruta
  const handleCreate = (routeData: Route, onSuccess?: (newRoute: Route) => void) => {
    if (!validateRoute(routeData)) return;

    try {
      setLoading(true);
      const newRoute = routeService.create(routeData);
      setErrors([]);
      // Usar el método correcto del store de rutas
      store.addRoute(newRoute);

      onSuccess?.(newRoute);
      console.log('Nueva ruta creada:', newRoute);

    } catch (error) {
      console.error('Error creating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ruta existente
  const handleUpdate = async (routeData: Partial<Route>, onSuccess?: (updatedRoute: Route) => void) => {
    const id = routeData.id;
    if (!id) {
      setErrors(['ID de ruta es requerido para actualizar.']);
      options?.onError?.('ID de ruta es requerido para actualizar.');
      return;
    }

    if (!validateRoute(routeData)) return;

    try {
      setLoading(true);
      // Usar el método genérico heredado del Service base
      await routeService.updateById(id, routeData);

      // Actualizar el store
      store.updateRoute(id, routeData);

      // Obtener la ruta actualizada del store para el callback
      const updatedRoute = store.routes.find(r => r.id === id);
      if (updatedRoute) {
        onSuccess?.(updatedRoute);
        console.log('Ruta actualizada:', updatedRoute, routeData);
      }

      setErrors([]);

    } catch (error) {
      console.error('Error updating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ruta
  const handleDelete = async (id: string | number, onSuccess?: () => void) => {
    try {
      setLoading(true);
      await routeService.deleteById(id);

      // Usar el método correcto del store de rutas
      store.removeRoute(id);

      onSuccess?.();
      console.log('Ruta eliminada:', id);

    } catch (error) {
      console.error('Error deleting route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
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
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
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

  const loadExample = () => {
    for (const route of store.routes) {
      if (route.id) {
        handleDelete(route.id);
      }
    }
    for (const route of mockRoutes) {
      handleCreate(route);
    }
  };

  return {
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

    route: store.route,
    setRoute: store.setRoute,

    // Highlighting actions
    addHighlightedRoute: store.addHighlightedRoute,
    removeHighlightedRoute: store.removeHighlightedRoute,
    toggleHighlightedRoute: store.toggleHighlightedRoute,
    clearHighlightedRoutes: store.clearHighlightedRoutes,
    isRouteHighlighted: store.isRouteHighlighted,

    loadExample,
  };
}
