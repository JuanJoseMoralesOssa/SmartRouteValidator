import { cityService } from "@/features/city/services/CityService";
import { useController } from "@/shared/hooks/useGenericController";
import { City } from "@/shared/types/entities/City";


export function useCityController() {
  return useController<City>(
    { color: '', name: '', id: crypto.randomUUID() },
    cityService,
    {
      validate: (city) =>
        city.name.trim() === ''
          ? ['El nombre es requerido.']
          : []
    }
  );
}
