import { useState } from 'react'
import Swal from 'sweetalert2'
import { RouteFormProps } from '../types/props/RouteFormProps'
import useRouteStore from '../store/useRouteStore'
import { Route } from '@/shared/types/entities/Route'
import { DEFAULTCITY } from '@constants/cts'


const RouteEdit = ({ onSave }: RouteFormProps) => {
    const { routeEdit } = useRouteStore()
    const initialData = routeEdit
    const [formData] = useState<Partial<Route>>(
        initialData || {
            origin: DEFAULTCITY,
            destiny: DEFAULTCITY,
            cost: 0,
            isDirectRoute: true,
            intermediateStops: [],
        }
    )

    const showForm = async () => {
        const { value: formValues } = await Swal.fire({
            title: initialData ? 'Editar Ruta' : 'Nueva Ruta',
            html: `
                <div class='space-y-4'>
                    <div class='w-full gap-1.5 flex items-center justify-between md:align-middle flex-col md:flex-row mb-4'>
                        <label for='originCity'
                        >Ciudad de Origen</label>
                        <input
                        class="border border-gray-300 rounded px-2 py-2"
                            id='originCity'
                            value="${formData.origin?.name ?? ''}"
                            required
                        />
                    </div>
                    <div class='w-full flex items-center justify-between md:align-middle flex-col md:flex-row mb-4'>
                        <label for='destinationCity'
                        >Ciudad de Destino</label>
                        <input
                        class="border border-gray-300 rounded px-2 py-2"
                            id='destinationCity'
                            value="${formData.destiny?.name ?? ''}"
                            required
                        />
                    </div>
                    <div class='w-full gap-1.5 flex items-center justify-between md:align-middle flex-col md:flex-row mb-4'>
                        <label for='cost'
                        >Costo</label>
                        <input
                        class="border border-gray-300 rounded px-2 py-2"
                            id='cost'
                            type='number'
                            min='0'
                            step='0.01'
                            value="${formData.cost ?? 0}"
                            required
                        />
                    </div>
                    <div class='w-full gap-1.5 flex items-center justify-between md:align-middle flex-col md:flex-row mb-4'>
                        <label for='intermediateStops'>
                            Escalas (separadas por coma)
                        </label>
                        <input
                        class="border border-gray-300 rounded px-2 py-2 w-1/2"
                            id='intermediateStops'
                            value="${formData.intermediateStops?.join(', ') ?? ''}"
                        />
                    </div>
                </div>`,
            showCancelButton: true,
            confirmButtonText: initialData ? 'Guardar Cambios' : 'Crear Ruta',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const origin = (
                    document.getElementById('originCity') as HTMLInputElement
                ).value
                const destiny = (
                    document.getElementById('destinationCity') as HTMLInputElement
                ).value
                const cost = (document.getElementById('cost') as HTMLInputElement)
                    .value
                const intermediateStops = (
                    document.getElementById('intermediateStops') as HTMLInputElement
                ).value

                if (!origin || !destiny || !cost) {
                    Swal.showValidationMessage(
                        'Los campos de la ciudad de origen, el destino y el costo son requeridos'
                    )
                    return false
                }

                return {
                    origin: {
                        name: origin,
                        color: ''
                    },
                    destiny: {
                        name: destiny,
                        color: ''
                    },
                    cost: parseFloat(cost),
                    intermediateStops: intermediateStops
                        ? intermediateStops.split(',').map((s) => s.trim())
                        : [],
                    isDirectRoute:
                        !intermediateStops || intermediateStops.trim().length === 0,
                }
            },
        })

        if (formValues) {
            onSave(formValues)
        }
    }

    return (
        <div>
            <button
                onClick={showForm}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                Agregar Nueva Ruta
            </button>
        </div>
    )
}

export default RouteEdit
