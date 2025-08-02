import { useController } from "@/shared/hooks/useGenericController";
import { City } from "@/shared/types/entities/City";
import { cityService } from "../services/CityService";
import useCityStore from "../stores/useCityStore";

export function useCityController() {
  return useController<City>(
    { color: '', name: '', id: crypto.randomUUID() },
    cityService,
    useCityStore,
    {
      validate: (city) =>
        city.name.trim() === ''
          ? ['El nombre es requerido.']
          : []
    }
  );
}
