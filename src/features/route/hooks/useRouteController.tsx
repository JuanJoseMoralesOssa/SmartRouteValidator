import { useState } from "react";
import useRouteStore from "../stores/useRouteStore";
import { Route } from "@/shared/types/entities/Route";
import { routeService } from "../services/RouteService";
import { mockRoutes } from "@/shared/types/mocks/MockRoutes";
import { useToast } from "@/shared/hooks/toast/useToast";
import { useConfirm } from "@/shared/hooks/toast/useConfirm";

interface UseRouteControllerOptions {
  validate?: (route: Route | Partial<Route>) => string[];
  onError?: (error: string) => void;
  enableVisualization?: boolean; // Habilitar animación paso a paso
  visualizationDelay?: number; // Delay entre pasos (ms)
}

/**
 * Hook simplificado para manejar rutas
 * - Validación pura (sin efectos secundarios)
 * - Visualización opcional y controlada
 * - Flujo claro y lineal
 */
export function useRouteController(options?: UseRouteControllerOptions) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const store = useRouteStore();
  const toast = useToast();
  const confirm = useConfirm();

  // Helper para pausar (visualización)
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  // Crear nueva ruta con visualización opcional
  const handleCreate = async (routeData: Route, onSuccess?: (newRoute: Route) => void) => {
    if (!validateRoute(routeData)) return;

    try {
      setLoading(true);
      store.clearHighlightedRoutes();

      // Validar y crear (el servicio retorna las rutas exploradas)
      const { route: newRoute, validation } = await routeService.createWithValidation(routeData);

      // Visualizar el proceso si está habilitado
      if (options?.enableVisualization && validation.exploredRoutes.length > 0) {
        for (const routeId of validation.exploredRoutes) {
          store.addHighlightedRoute(routeId);
          await sleep(options.visualizationDelay || 500);
        }
      }

      store.addRoute(newRoute);
      setErrors([]);
      onSuccess?.(newRoute);
      toast.success('Guardado con éxito');

    } catch (error) {
      console.error('Error creating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
      toast.error(errorMessage);
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
      store.clearHighlightedRoutes();

      // Validar y actualizar
      const validation = await routeService.updateWithValidation(id, routeData);

      // Visualizar el proceso si está habilitado
      if (options?.enableVisualization && validation.exploredRoutes.length > 0) {
        for (const routeId of validation.exploredRoutes) {
          store.addHighlightedRoute(routeId);
          await sleep(options.visualizationDelay || 500);
        }
      }

      store.updateRoute(id, routeData);

      const updatedRoute = store.routes.find(r => r.id === id);
      if (updatedRoute) {
        onSuccess?.(updatedRoute);
      }

      setErrors([]);
      toast.success('Actualizado con éxito');

    } catch (error) {
      console.error('Error updating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };  // Eliminar ruta
  const handleDelete = async (id: string | number, onSuccess?: () => void) => {
    try {
      setLoading(true);
      await routeService.deleteById(id);

      // Usar el método correcto del store de rutas
      store.removeRoute(id);

      onSuccess?.();
      console.log('Ruta eliminada:', id);
      // confirm(
      //   'Eliminar elemento',
      //   '¿Estás seguro que deseas eliminar este registro?',
      //   () => toast.success('Eliminado correctamente'),
      //   () => toast.info('Cancelado')
      // );
      // descomenta en el otro codigo el use Confirm con toast
      confirm(
        'Eliminar elemento',
        '¿Estás seguro que deseas eliminar este registro?',
      );

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

  // Cargar ejemplos con visualización opcional
  const loadExample = async () => {
    try {
      setLoading(true);

      // Eliminar todas las rutas existentes
      for (const route of store.routes) {
        if (route.id) {
          await routeService.deleteById(route.id);
        }
      }

      // Limpiar todo de una vez
      store.setRoutes([]);
      store.clearHighlightedRoutes();

      // Acumular todas las nuevas rutas
      const newRoutes: Route[] = [];

      // Crear las rutas de ejemplo de forma secuencial
      for (const route of mockRoutes) {
        if (!validateRoute(route)) continue;

        store.clearHighlightedRoutes();

        // Validar y crear la ruta
        const { route: newRoute, validation } = await routeService.createWithValidation(route);

        // Visualizar el proceso si está habilitado
        if (options?.enableVisualization && validation.exploredRoutes.length > 0) {
          for (const routeId of validation.exploredRoutes) {
            store.addHighlightedRoute(routeId);
            await sleep(options.visualizationDelay || 500);
          }
          // Limpiar antes de la siguiente ruta
          await sleep(300);
          store.clearHighlightedRoutes();
        }

        // Acumular en lugar de agregar inmediatamente
        newRoutes.push(newRoute);
      }

      // Agregar todas las rutas de una sola vez para evitar múltiples re-renders
      store.setRoutes(newRoutes);

      toast.success('Ejemplos cargados correctamente');
      setErrors([]);

    } catch (error) {
      console.error('Error loading examples:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error cargando ejemplos';
      setErrors([errorMessage]);
      toast.error(errorMessage);
      store.clearHighlightedRoutes();
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
