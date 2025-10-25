import { City } from "@/shared/types/entities/City";
import { cityService } from "../services/CityService";
import useCityStore from "../stores/useCityStore";
import { useState } from "react";
import { mockCities } from "@/shared/types/mocks/MockCities";


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
        return ['Name is required.'];
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

  // Crear nueva ciudad
  const handleCreate = (cityData: City, onSuccess?: (newCity: City) => void) => {
    if (!validateCity(cityData)) return;

    try {
      setLoading(true);
      const newCity = cityService.create(cityData);
      setErrors([]);

      // Usar el método correcto del store de ciudads
      store.addCity(newCity);

      onSuccess?.(newCity);
      console.log('New city created:', newCity);

    } catch (error) {
      console.error('Error creating city:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ciudad existente
  const handleUpdate = async (cityData: Partial<City>, onSuccess?: (updatedCity: City) => void) => {
    const id = cityData.id;
    if (!id) {
      setErrors(['City ID is required for updating.']);
      options?.onError?.('City ID is required for updating.');
      return;
    }

    if (!validateCity(cityData)) return;

    try {
      setLoading(true);
      // Usar el método genérico heredado del Service base
      await cityService.updateById(id, cityData);

      // Actualizar el store
      store.updateCity(id, cityData);

      // Obtener la ciudad actualizada del store para el callback
      const updatedCity = store.cities.find(r => r.id === id);
      if (updatedCity) {
        onSuccess?.(updatedCity);
        console.log('City updated:', updatedCity);
      }

      setErrors([]);

    } catch (error) {
      console.error('Error updating city:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ciudad
  const handleDelete = async (id: string | number, onSuccess?: () => void) => {
    try {
      setLoading(true);
      await cityService.deleteById(id);

      // Usar el método correcto del store de ciudads
      store.removeCity(id);

      onSuccess?.();
      console.log('City deleted:', id);

    } catch (error) {
      console.error('Error deleting city:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las ciudads
  const handleGetAll = () => {
    try {
      setLoading(true);
      const cities = cityService.getAll();
      store.setCities(cities);
      return cities;
    } catch (error) {
      console.error('Error getting all cities:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener ciudad por ID
  const handleGetById = async (id: string | number) => {
    try {
      return await cityService.findById(id);
    } catch (error) {
      console.error('Error getting city by id:', error);
      return null;
    }
  };


  const loadExample = () => {
    for (const city of store.cities) {
      if (city.id) {
        handleDelete(city.id);
      }
    }
    for (const city of mockCities) {
      handleCreate(city);
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

    loadExample,
  };
}
