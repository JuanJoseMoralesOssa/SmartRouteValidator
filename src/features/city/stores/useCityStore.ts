import { City } from '@/shared/types/entities/City'
import { createGenericStore } from '@/shared/stores/createGenericStore'


const useBaseStore = createGenericStore<City>()

const useCityStore = () => {
  const baseStore = useBaseStore()
  return {
    cities: baseStore.items,
    setCities: baseStore.setItems,
    addCity: baseStore.addItem,
    updateCity: baseStore.updateItem,
    removeCity: baseStore.removeItem,

    city: baseStore.item,
    setCity: baseStore.setItem,
    ...baseStore,
  }
}

export default useCityStore
