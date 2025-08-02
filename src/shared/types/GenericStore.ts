export interface GenericStore<T> {
  item: T | null
  setItem: (item: T) => void
  removeItem: () => void
  items: T[] | null
  setItems: (items: T[]) => void
  removeItems: () => void
}
