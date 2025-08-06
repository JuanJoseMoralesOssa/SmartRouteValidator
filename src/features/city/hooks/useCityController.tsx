import { City } from "@/shared/types/entities/City";
import { cityService } from "../services/CityService";
import useCityStore from "../stores/useCityStore";
import { useState } from "react";


interface UseCityControllerOptions {
  validate?: (city: City | Partial<City>) => string[];
  onError?: (error: string) => void;
}

export function useCityController(options?: UseCityControllerOptions) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const store = useCityStore();

  // Validación
  const validateCity = (cityToValidate: City | Partial<City>): boolean => {
    const defaultValidation = (city: City | Partial<City>) => {
      if (city.name?.trim() === '') {
        return ['El nombre es requerido.'];
      }
      return [];
    };

    const validationErrors = options?.validate?.(cityToValidate) ?? defaultValidation(cityToValidate);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      options?.onError?.(validationErrors.join(', '));
      return false;
    }

    setErrors([]);
    return true;
  };

  // Crear nueva ruta
  const handleCreate = (cityData: City, onSuccess?: (newCity: City) => void) => {
    if (!validateCity(cityData)) return;

    try {
      setLoading(true);
      const newCity = cityService.create(cityData);
      setErrors([]);

      // Usar el método correcto del store de rutas
      store.addCity(newCity);

      onSuccess?.(newCity);
      console.log('Nueva ruta creada:', newCity);

    } catch (error) {
      console.error('Error creating city:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ruta existente
  const handleUpdate = async (cityData: Partial<City>, onSuccess?: (updatedCity: City) => void) => {
    const id = cityData.id;
    if (!id) {
      setErrors(['ID de ruta es requerido para actualizar.']);
      options?.onError?.('ID de ruta es requerido para actualizar.');
      return;
    }

    if (!validateCity(cityData)) return;

    try {
      setLoading(true);
      // Usar el método genérico heredado del Service base
      await cityService.updateById(id, cityData);

      // Actualizar el store
      store.updateCity(id, cityData);

      // Obtener la ruta actualizada del store para el callback
      const updatedCity = store.cities.find(r => r.id === id);
      if (updatedCity) {
        onSuccess?.(updatedCity);
        console.log('Ruta actualizada:', updatedCity);
      }

      setErrors([]);

    } catch (error) {
      console.error('Error updating city:', error);
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
      await cityService.deleteById(id);

      // Usar el método correcto del store de rutas
      store.removeCity(id);

      onSuccess?.();
      console.log('Ruta eliminada:', id);

    } catch (error) {
      console.error('Error deleting city:', error);
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
      const cities = cityService.getAll();
      store.setCities(cities);
      return cities;
    } catch (error) {
      console.error('Error getting all cities:', error);
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
      return await cityService.findById(id);
    } catch (error) {
      console.error('Error getting city by id:', error);
      return null;
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
    cities: store.cities,
    setCities: store.setCities,

    city: store.city,
    setCity: store.setCity,
  };
}
