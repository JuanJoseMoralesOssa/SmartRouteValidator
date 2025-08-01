import { useState } from "react"
import { Service } from "../services/service";
import { DataObject } from "../types/DataObject";

interface UseControllerOptions<T> {
  validate?: (item: T) => string[];
  onError?: (error: string) => void;
}

export function useController<T extends DataObject<T>>(
  initialValue: T,
  service: Service<T>,
  localArray: T[] | null,
  setLocalArray: (routes: T[]) => void,
  options?: UseControllerOptions<T>
) {
  const [item, setItem] = useState<T>(initialValue)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setItem(prev => ({ ...prev, [name]: value }))
  }

  const validateItem = (data: T): boolean => {
    if (options?.validate) {
      const validationErrors = options.validate(data)
      setErrors(validationErrors)
      return validationErrors.length === 0
    }
    return true
  }

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    setErrors([errorMessage])

    // Llamar callback de error si existe
    options?.onError?.(errorMessage)

    // También podríamos usar un sistema de notificaciones global aquí
    console.error('Controller error:', error)
  }

  const handleCreate = (item: T, onSuccess?: (newItem: T) => void) => {
    if (!validateItem(item)) return
    console.log("hola");

    try {
      setLoading(true)
      const newItem = service.create(item)
      setItem(newItem)
      setErrors([])
      onSuccess?.(newItem)

      const updatedRoutes = [...(localArray ?? []), item]
      setLocalArray(updatedRoutes)
      console.log('Nueva ruta creada:', item)

    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (onSuccess?: (updatedItem: T) => void) => {
    if (!validateItem(item)) return

    setLoading(true)
    try {
      if (item.id) {
        await service.updateById(item.id, item)
        // const updated = await service.update(item)
        setErrors([])
        onSuccess?.(item)
      }

      const updatedRoutes = localArray ? localArray.map((r) => (r.id === item.id ? item : r)) : [item]
      setLocalArray(updatedRoutes)
      console.log('Ruta editada:', item)

    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string | number, onSuccess?: () => void) => {
    setLoading(true)
    try {
      await service.deleteById(id)
      setItem(initialValue)
      setErrors([])
      onSuccess?.()

      const updatedRoutes = localArray ? [...localArray.filter((ele) => ele.id !== id), item] : [item]
      setLocalArray(updatedRoutes)
      console.log('Ruta eliminada:', item)

    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGet = async (id: string | number, onSuccess?: (item: T) => void) => {
    setLoading(true)
    setErrors([])

    try {
      const fetchedItem = await service.findById(id)
      setItem(fetchedItem as T)
      onSuccess?.(fetchedItem as T)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetAllData = (): T[] => {
    setLoading(true)
    setErrors([])

    try {
      return service.getAll()
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setLoading(false)
    }
  }


  return {
    item,
    setItem,
    loading,
    errors,
    setErrors,
    handleChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleGet,
    handleGetAllData
  }
}
