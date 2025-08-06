import { useState } from "react"
import { Service } from "../services/service";
import { DataObject } from "../types/DataObject";
import { ID } from "../types/ID";

interface UseControllerOptions<T> {
  validate?: (item: T | Partial<T>) => string[];
  onError?: (error: string) => void;
}

export function useController<T extends DataObject<T>>(
  service: Service<T>,
  options?: UseControllerOptions<T>
) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

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

    try {
      setLoading(true)
      const newItem = service.create(item)
      setErrors([])
      onSuccess?.(newItem)


    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (item: T, onSuccess?: (updatedItem: T) => void) => {
    if (!validateItem(item)) return
    console.log("hola", item);

    setLoading(true)
    try {
      if (item.id) {
        await service.updateById(item.id, item)
        // const updated = await service.update(item)
        setErrors([])
        onSuccess?.(item)

        console.log('Ruta editada:', item)
        console.log("data", handleGetAllData());
        console.log("data", handleGetAllDict());
      }

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
      setErrors([])
      onSuccess?.()

      console.log("data", handleGetAllData());
      console.log("data", handleGetAllDict());

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
      onSuccess?.(fetchedItem as T)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetAllDict = (): Map<ID, T> => {
    setLoading(true)
    setErrors([])

    try {
      return service.getAllDict()
    } catch (error) {
      handleError(error)
      return new Map()
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
    loading,
    errors,
    setErrors,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleGet,
    handleGetAllData
  }
}
