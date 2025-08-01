import { DictionaryRepository } from "@/shared/repositories/repository";
import { City } from "@/shared/types/entities/City";

export class CityRepository extends DictionaryRepository<City> {

}

export const cityRepository = new CityRepository()
