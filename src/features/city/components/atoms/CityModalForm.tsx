import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { City } from '@/shared/types/entities/City'
import Modal from '@/shared/components/atoms/Modal'
import { useEffect, useState } from 'react'
import { DEFAULT_ICONS, CITY_SVG_TYPES } from '../../constants/cts'
import { DEFAULT_COLORS } from '@/shared/constants/cts'
import Autocomplete, { AutocompleteOption } from '@/shared/components/atoms/Autocomplete'
import { useCityController } from '../../hooks/useCityController'
import { mockCities } from '@/shared/types/mocks/MockCities'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  color: z.string().min(1, 'Color is required'),
  svgType: z.string().min(1, 'You must select an SVG type'),
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

const getRandomItem = <T,>(array: ReadonlyArray<T>): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export default function CityModalForm({ isOpen, onClose, onSubmit, initialData }: Readonly<CityModalFormProps>) {
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSvgType, setSelectedSvgType] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('')
  const { cities, setCities } = useCityController()

  // Inicializar las ciudades mock si no hay ciudades cargadas
  useEffect(() => {
    if (cities.length === 0) {
      setCities(mockCities)
    }
  }, [cities.length, setCities])

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
  const watchedIcon = watch('icon')

  // Convertir tipos de SVG a opciones de autocomplete
  const svgTypeOptions: AutocompleteOption[] = CITY_SVG_TYPES.map(svg => ({
    id: svg.value,
    label: svg.label,
    value: svg.value,
    component: svg.component
  }))

  // Función para obtener el label actual del tipo SVG seleccionado
  const getCurrentSvgLabel = () => {
    const currentOption = svgTypeOptions.find(opt => opt.value === selectedSvgType)
    return currentOption ? String(currentOption.label) : ''
  }

  // Handler para la selección de tipo SVG
  const handleSvgTypeSelect = (option: AutocompleteOption | null) => {
    if (option) {
      setSelectedSvgType(option.value as string)
      setValue('svgType', option.value as string)
    } else {
      setSelectedSvgType('')
      setValue('svgType', '')
    }
  }

  // Resetear el formulario cada vez que cambien los datos iniciales o se abra el modal
  useEffect(() => {
    if (isOpen) {
      // Usar el color existente o seleccionar uno aleatorio de la paleta de colores única
      const defaultColor = initialData?.color || getRandomItem(DEFAULT_COLORS)
      const defaultSvgType = initialData?.svgType || getRandomItem(CITY_SVG_TYPES).value
      const defaultIcon = initialData?.icon || getRandomItem(DEFAULT_ICONS).value

      const resetValues = {
        name: initialData?.name ?? '',
        color: defaultColor,
        svgType: defaultSvgType,
        icon: defaultIcon,
        id: initialData?.id,
      }

      setSelectedColor(defaultColor)
      setSelectedSvgType(defaultSvgType)
      setSelectedIcon(defaultIcon)
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
      setSelectedColor('')
      setSelectedSvgType('')
      setSelectedIcon('')
    }
  }, [isOpen, initialData, reset])  // Actualizar estados locales cuando cambien los valores del formulario
  useEffect(() => {
    if (watchedColor) setSelectedColor(watchedColor)
  }, [watchedColor])

  useEffect(() => {
    if (watchedSvgType) setSelectedSvgType(watchedSvgType)
  }, [watchedSvgType])

  useEffect(() => {
    if (watchedIcon) setSelectedIcon(watchedIcon)
  }, [watchedIcon])

  const submitForm = (values: FormValues) => {
    const city: City = {
      name: values.name,
      color: values.color,
      svgType: values.svgType,
      icon: values.icon ?? undefined,
      id: values.id ?? undefined,
    }
    onSubmit(city)
    onClose()
  }

  const renderSvgPreview = () => {
    const svgType = CITY_SVG_TYPES.find(svg => svg.value === selectedSvgType)
    if (!svgType) return null

    const SvgComponent = svgType.component
    return (
      <div className="flex items-center justify-center p-4 border rounded-md bg-gray-50">
        <SvgComponent color={selectedColor || '#FF6B6B'} width={64} height={64} />
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='h-screen'
      title={initialData ? 'Edit City' : 'New City'}
    >
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <label htmlFor='name' className="block text-sm font-medium">City Name</label>
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
          <p className="text-xs text-gray-500 mt-1">Select from the palette or use the personalized color selector</p>
          <div className="mt-2 grid grid-cols-8 gap-1">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setSelectedColor(color)
                  setValue('color', color)
                }}
                className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-gray-500 hover:scale-110 transition-all duration-200"
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
                title={color}
              />
            ))}
          </div>
          {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
        </div>

        <div>
          <Autocomplete
            label="Icon type"
            options={svgTypeOptions}
            displayKey="label"
            placeholder="Search icon type..."
            onSelect={handleSvgTypeSelect}
            initialValue={getCurrentSvgLabel()}
            required
            clearable
            noOptionsText="No icon types found"
          />
          {errors.svgType && <p className="text-red-500 text-sm">{errors.svgType.message}</p>}
          <p className="text-xs text-gray-500 mt-1">Or select visually from the gallery</p>
          <div className="mt-2 grid grid-cols-4 gap-3">
            {CITY_SVG_TYPES.map((svg) => {
              const SvgComponent = svg.component
              const isSelected = selectedSvgType === svg.value
              return (
                <button
                  key={svg.value}
                  type="button"
                  onClick={() => {
                    setSelectedSvgType(svg.value)
                    setValue('svgType', svg.value)
                  }}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                  title={svg.label}
                  aria-label={`Select ${svg.label}`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <SvgComponent
                      color={selectedColor || '#6B7280'}
                      width={40}
                      height={40}
                    />
                    <span className="text-xs font-medium text-center">{svg.label.replace('City ', '').replace('Skyline ', '')}</span>
                  </div>
                </button>
              )
            })}
          </div>
          {errors.svgType && <p className="text-red-500 text-sm">{errors.svgType.message}</p>}
        </div>

        <div>
          <div className="block text-sm font-medium mb-2">Svg Preview</div>
          {renderSvgPreview()}
        </div>

        <div>
          <label htmlFor='icon' className="block text-sm font-medium">Custom Icon</label>
          <input
            id='icon'
            {...register('icon')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="🏙️, 🌆, 🌃... or write your own emoji"
          />
          <p className="text-xs text-gray-500 mt-1">Select from the gallery or write your own emoji</p>
          <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
            {DEFAULT_ICONS.map((iconOption) => {
              const isSelected = selectedIcon === iconOption.value
              return (
                <button
                  key={iconOption.value}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(iconOption.value)
                    setValue('icon', iconOption.value)
                  }}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                  title={iconOption.label}
                  aria-label={`Select ${iconOption.label}`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-2xl">{iconOption.value}</span>
                    <span className="text-xs font-medium text-center leading-tight">{iconOption.label.replace('City ', '')}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            {initialData ? 'Save' : 'Create City'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
