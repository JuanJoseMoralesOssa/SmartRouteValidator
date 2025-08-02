import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { GenericStore } from '../types/GenericStore'

/**
 * Hook genérico para crear un store con Zustand
 * @param name Nombre del almacenamiento persistente (ej: 'routeStore')
 * @returns Hook Zustand con tipado dinámico
 */
export function createGenericStore<T>(name: string) {
  return create<GenericStore<T>>()(
    persist(
      (set) => ({
        item: null,
        setItem: (item: T) => set({ item }),
        removeItem: () => set({ item: null }),
        items: null,
        setItems: (items: T[]) => set({ items }),
        removeItems: () => set({ items: null })
      }),
      {
        name,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
}
