import { create } from 'zustand'
import { ID } from '../types/ID'
import { DataObject } from '../types/DataObject'

interface StoreState<T> {
  items: T[]
  setItems: (items: T[]) => void
  addItem: (item: T) => void
  updateItem: (id: ID, item: Partial<T>) => void
  removeItem: (id: ID) => void

  item: T | null
  setItem: (item: T) => void
  clearItem: () => void
}

const updateItems = <T extends DataObject<T>>(items: T[], id: ID, updatedFields: Partial<T>): T[] => {
  return items.map(item =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
};

const removeItems = <T extends DataObject<T>>(items: T[], id: ID): T[] => {
  return items.filter(item => item.id !== id);
};

export const createGenericStore = <T extends DataObject<T>>() =>
  create<StoreState<T>>((set) => {
    return {
      items: [],
      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      updateItem: (id, updatedFields) => set((state) => ({
        items: updateItems(state.items, id, updatedFields)
      })),
      removeItem: (id) => set((state) => ({
        items: removeItems(state.items, id)
      })),
      item: null,
      setItem: (item) => set({ item }),
      clearItem: () => set({ item: null })
    };
  })
