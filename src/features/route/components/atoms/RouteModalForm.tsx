import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/shared/types/entities/Route'
import { DEFAULTCITY } from '@constants/cts'
import Modal from '@/shared/components/atoms/Modal'

const formSchema = z.object({
  origin: z.string().min(1, 'Requerido'),
  destiny: z.string().min(1, 'Requerido'),
  cost: z.number().min(0, 'Debe ser mayor o igual a 0'),
  intermediateStops: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface RouteModalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Route>) => void
  initialData?: Partial<Route>
}

export default function RouteModalForm({ isOpen, onClose, onSubmit, initialData }: Readonly<RouteModalFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: initialData?.origin?.name ?? DEFAULTCITY.name,
      destiny: initialData?.destiny?.name ?? DEFAULTCITY.name,
      cost: initialData?.cost ?? 0,
      intermediateStops: initialData?.intermediateStops?.join(', ') ?? '',
    },
  })

  const submitForm = (values: FormValues) => {
    const route: Partial<Route> = {
      origin: { name: values.origin, color: '' },
      destiny: { name: values.destiny, color: '' },
      cost: values.cost,
      intermediateStops: values.intermediateStops
        ? values.intermediateStops.split(',').map((s) => s.trim())
        : [],
      isDirectRoute:
        !values.intermediateStops || values.intermediateStops.trim().length === 0,
    }
    onSubmit(route)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Ruta' : 'Nueva Ruta'}
    >
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <label htmlFor='origin' className="block text-sm font-medium">Ciudad de Origen</label>
          <input
            id='origin'
            {...register('origin')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.origin && <p className="text-red-500 text-sm">{errors.origin.message}</p>}
        </div>
        <div>
          <label htmlFor='destiny' className="block text-sm font-medium">Ciudad de Destino</label>
          <input
            id='destiny'
            {...register('destiny')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.destiny && <p className="text-red-500 text-sm">{errors.destiny.message}</p>}
        </div>
        <div>
          <label htmlFor='cost' className="block text-sm font-medium">Costo</label>
          <input
            type="number"
            id='cost'
            {...register('cost', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
        </div>
        <div>
          <label htmlFor='intermediateStops' className="block text-sm font-medium">Escalas (separadas por coma)</label>
          <input
            id='intermediateStops'
            {...register('intermediateStops')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
