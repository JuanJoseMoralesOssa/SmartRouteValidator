import { Service } from "@/shared/services/service";
import { City } from "@/shared/types/entities/City";
import { cityRepository } from "../repositories/CityRepository";

export class CityService extends Service<City> {
}
export const cityService = new CityService(cityRepository)
