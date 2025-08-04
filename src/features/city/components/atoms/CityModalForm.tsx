import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { City } from '@/shared/types/entities/City'
import Modal from '@/shared/components/atoms/Modal'
import { useEffect, useState } from 'react'
import ClassicCitySVG from '@/shared/components/atoms/svgs/ClassicCitySVG'
import DomedCitySVG from '@/shared/components/atoms/svgs/DomedCitySVG'
import FuturisticCitySVG from '@/shared/components/atoms/svgs/FuturisticCitySVG'
import SkylineSVG from '@/shared/components/atoms/svgs/SkylineSVG'

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  color: z.string().min(1, 'El color es requerido'),
  svgType: z.string().min(1, 'Debe seleccionar un tipo de SVG'),
  icon: z.string().optional(),
  id: z.string().optional().or(z.number().optional()).or(z.null()),
})

type FormValues = z.infer<typeof formSchema>

interface CityModalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: City) => void
  initialData?: City
}

const svgTypes = [
  { value: 'classic', label: 'Ciudad Clásica', component: ClassicCitySVG },
  { value: 'domed', label: 'Ciudad con Cúpulas', component: DomedCitySVG },
  { value: 'futuristic', label: 'Ciudad Futurista', component: FuturisticCitySVG },
  { value: 'skyline', label: 'Skyline Moderno', component: SkylineSVG },
]

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#AED6F1', '#F1948A', '#D2B4DE'
]

const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export default function CityModalForm({ isOpen, onClose, onSubmit, initialData }: Readonly<CityModalFormProps>) {
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSvgType, setSelectedSvgType] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const watchedColor = watch('color')
  const watchedSvgType = watch('svgType')

  // Resetear el formulario cada vez que cambien los datos iniciales o se abra el modal
  useEffect(() => {
    if (isOpen) {
      // Usar el color existente o seleccionar uno aleatorio de la paleta de colores única
      const defaultColor = initialData?.color || getRandomItem(defaultColors)
      const defaultSvgType = initialData ? 'classic' : getRandomItem(svgTypes).value

      const resetValues = {
        name: initialData?.name ?? '',
        color: defaultColor,
        svgType: defaultSvgType,
        icon: initialData?.name ? `${initialData.name}_icon` : '',
        id: initialData?.id,
      }

      setSelectedColor(defaultColor)
      setSelectedSvgType(defaultSvgType)
      reset(resetValues)
    } else {
      // Limpiar completamente el formulario cuando se cierra
      reset({
        name: '',
        color: '',
        svgType: '',
        icon: '',
        id: undefined,
      })
    }
  }, [isOpen, initialData, reset])  // Actualizar estados locales cuando cambien los valores del formulario
  useEffect(() => {
    if (watchedColor) setSelectedColor(watchedColor)
  }, [watchedColor])

  useEffect(() => {
    if (watchedSvgType) setSelectedSvgType(watchedSvgType)
  }, [watchedSvgType])

  const submitForm = (values: FormValues) => {
    const city: City = {
      name: values.name,
      color: values.color,
      id: values.id ?? undefined,
    }
    onSubmit(city)
    onClose()
  }

  const renderSvgPreview = () => {
    const svgType = svgTypes.find(svg => svg.value === selectedSvgType)
    if (!svgType) return null

    const SvgComponent = svgType.component
    return (
      <div className="flex items-center justify-center p-4 border rounded-md bg-gray-50">
        <SvgComponent color={selectedColor || '#3B82F6'} width={64} height={64} />
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Ciudad' : 'Nueva Ciudad'}
    >
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <label htmlFor='name' className="block text-sm font-medium">Nombre de la Ciudad</label>
          <input
            id='name'
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Madrid, París, Tokyo..."
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor='color' className="block text-sm font-medium">Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              id='color'
              {...register('color')}
              className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              {...register('color')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#FF6B6B"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Selecciona de la paleta o usa el selector de color personalizado</p>
          <div className="mt-2 grid grid-cols-8 gap-1">
            {defaultColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setSelectedColor(color)
                  setValue('color', color)
                }}
                className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-gray-500 hover:scale-110 transition-all duration-200"
                style={{ backgroundColor: color }}
                aria-label={`Seleccionar color ${color}`}
                title={color}
              />
            ))}
          </div>
          {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
        </div>

        <div>
          <label htmlFor='svgType' className="block text-sm font-medium">Tipo de Ícono</label>
          <select
            id='svgType'
            {...register('svgType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un tipo...</option>
            {svgTypes.map((svg) => (
              <option key={svg.value} value={svg.value}>
                {svg.label}
              </option>
            ))}
          </select>
          {errors.svgType && <p className="text-red-500 text-sm">{errors.svgType.message}</p>}
        </div>

        <div>
          <div className="block text-sm font-medium mb-2">Vista Previa</div>
          {renderSvgPreview()}
        </div>

        <div>
          <label htmlFor='icon' className="block text-sm font-medium">Ícono Personalizado (Opcional)</label>
          <input
            id='icon'
            {...register('icon')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="🏙️, 🌆, 🌃..."
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
            {initialData ? 'Guardar' : 'Crear Ciudad'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
