import { Service } from "@/shared/services/service";
import { cityRepository } from "../repositories/CityRepository";
import { City } from "@/shared/types/entities/City";

export class CityService extends Service<City> {
}

export const cityService = new CityService(cityRepository)
