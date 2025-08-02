import { City } from '@/shared/types/entities/City'
import { createGenericStore } from '@/shared/stores/createGenericStore'

const useCityStore = createGenericStore<City>('cityStore')
export default useCityStore
