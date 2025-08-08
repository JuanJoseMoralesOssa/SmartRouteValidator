import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/shared/types/entities/Route'
import { DEFAULT_CITY } from '@constants/cts'
import Modal from '@/shared/components/atoms/Modal'
import { useEffect, useState } from 'react'
import { CitySvgEnum } from '@/features/city/enums/CitySvgEnum'
import Autocomplete, { AutocompleteOption } from '@/shared/components/atoms/Autocomplete'
import useCityStore from '@/features/city/stores/useCityStore'
import { City } from '@/shared/types/entities/City'
// import { mockCities } from '@/shared/types/mocks/MockCities'

const formSchema = z.object({
  origin: z.string().min(1, 'Requerido'),
  destiny: z.string().min(1, 'Requerido'),
  cost: z.union([
    z.number().min(0, 'Debe ser mayor o igual a 0'),
    z.nan(),
    z.undefined()
  ]).optional(),
  id: z.string().optional().or(z.number().optional()).or(z.null()),
})

type FormValues = z.infer<typeof formSchema>

interface RouteModalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Route) => void
  initialData?: Route
}

export default function RouteModalForm({ isOpen, onClose, onSubmit, initialData }: Readonly<RouteModalFormProps>) {
  const { cities } = useCityStore()
  const [selectedOrigin, setSelectedOrigin] = useState<City | null>(null)
  const [selectedDestiny, setSelectedDestiny] = useState<City | null>(null)

  // Inicializar las ciudades mock si no hay ciudades cargadas
  // useEffect(() => {
  //   if (cities.length === 0) {
  //     setCities(mockCities)
  //   }
  // }, [cities.length, setCities])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  // Convertir ciudades a opciones de autocomplete
  const cityOptions: AutocompleteOption[] = cities.map(city => ({
    id: city.id || city.name,
    label: city.name,
    ...city
  }))

  // Resetear el formulario cada vez que cambien los datos iniciales o se abra el modal
  useEffect(() => {
    if (isOpen) {
      const resetValues = {
        origin: initialData?.origin?.name ?? DEFAULT_CITY.name,
        destiny: initialData?.destiny?.name ?? DEFAULT_CITY.name,
        cost: initialData?.cost,
        id: initialData?.id,
      }
      reset(resetValues)

      // Establecer las ciudades seleccionadas
      if (initialData?.origin) {
        setSelectedOrigin(initialData.origin)
      } else {
        setSelectedOrigin(null)
      }

      if (initialData?.destiny) {
        setSelectedDestiny(initialData.destiny)
      } else {
        setSelectedDestiny(null)
      }
    } else {
      // Limpiar completamente el formulario cuando se cierra
      reset({
        origin: '',
        destiny: '',
        cost: undefined,
        id: undefined,
      })
      setSelectedOrigin(null)
      setSelectedDestiny(null)
    }
  }, [isOpen, initialData, reset])

  const handleOriginSelect = (option: AutocompleteOption | null) => {
    if (option) {
      const city = option as City & AutocompleteOption
      setSelectedOrigin(city)
      setValue('origin', city.name)
    } else {
      setSelectedOrigin(null)
      setValue('origin', '')
    }
  }

  const handleDestinySelect = (option: AutocompleteOption | null) => {
    if (option) {
      const city = option as City & AutocompleteOption
      setSelectedDestiny(city)
      setValue('destiny', city.name)
    } else {
      setSelectedDestiny(null)
      setValue('destiny', '')
    }
  }

  const submitForm = (values: FormValues) => {
    const originCity = selectedOrigin ?? { name: values.origin, color: '#FF6B6B', svgType: CitySvgEnum.Classic }
    const destinyCity = selectedDestiny ?? { name: values.destiny, color: '#4ECDC4', svgType: CitySvgEnum.Classic }

    const route: Route = {
      originId: originCity.id,
      destinyId: destinyCity.id,
      origin: originCity,
      destiny: destinyCity,
      cost: (values.cost !== undefined && !isNaN(values.cost)) ? values.cost : 0,
      id: values.id ?? undefined,
    }
    onSubmit(route)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-h-fit h-fit overflow-y-auto'
      title={initialData ? 'Editar Ruta' : 'Nueva Ruta'}
    >
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4 flex flex-col justify-between h-fit">
        <div>
          <Autocomplete
            label="Ciudad de Origen"
            options={cityOptions}
            displayKey="name"
            placeholder="Buscar ciudad de origen..."
            onSelect={handleOriginSelect}
            initialValue={selectedOrigin?.name || ''}
            required
            clearable
          />
          {errors.origin && <p className="text-red-500 text-sm">{errors.origin.message}</p>}
        </div>
        <div>
          <Autocomplete
            label="Ciudad de Destino"
            options={cityOptions}
            displayKey="name"
            placeholder="Buscar ciudad de destino..."
            onSelect={handleDestinySelect}
            initialValue={selectedDestiny?.name || ''}
            required
            clearable
          />
          {errors.destiny && <p className="text-red-500 text-sm">{errors.destiny.message}</p>}
        </div>
        <div>
          <label htmlFor='cost' className="block text-sm font-medium">Costo</label>
          <input
            type="number"
            id='cost'
            {...register('cost', {
              valueAsNumber: true,
              setValueAs: (v) => v === '' ? undefined : Number(v)
            })}
            className={`
              w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${errors.cost ? 'border-red-300' : ''}
              bg-white
            `}
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            {initialData ? 'Guardar' : 'Crear Ruta'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
