import { useState } from 'react'
import Swal from 'sweetalert2'
import { Route } from '../types/Route'
import { RouteFormProps } from '../types/props/RouteFormProps'

const RouteFrom = ({ onSave, initialData }: RouteFormProps) => {
    const [formData] = useState<Partial<Route>>(
        initialData || {
            originCity: '',
            destinationCity: '',
            cost: 0,
            isDirectRoute: true,
            intermediateStops: [],
        }
    )

    const showForm = async () => {
        const { value: formValues } = await Swal.fire({
            title: initialData ? 'Editar Ruta' : 'Nueva Ruta',
            html: `
                <form class='space-y-4'>
                    <div class='w-full gap-1.5 flex items-center justify-between md:align-middle flex-col md:flex-row mb-4'>
                        <label for='originCity'
                        >Ciudad de Origen</label>
                        <input
                        class="border border-gray-300 rounded px-2 py-2"
                            id='originCity'
                            value="${formData.originCity ?? ''}"
                            required
                        />
                    </div>
                    <div class='w-full flex items-center justify-between md:align-middle flex-col md:flex-row mb-4'>
                        <label for='destinationCity'
                        >Ciudad de Destino</label>
                        <input
                        class="border border-gray-300 rounded px-2 py-2"
                            id='destinationCity'
                            value="${formData.destinationCity ?? ''}"
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
                    <button className='w-full'>
                        ${initialData ? 'Guardar Cambios' : 'Crear Ruta'}
                    </button>
                </form>`,
            showConfirmButton: false,
            showCloseButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const originCity = (
                    document.getElementById('originCity') as HTMLInputElement
                ).value
                const destinationCity = (
                    document.getElementById('destinationCity') as HTMLInputElement
                ).value
                const cost = (document.getElementById('cost') as HTMLInputElement)
                    .value
                const intermediateStops = (
                    document.getElementById('intermediateStops') as HTMLInputElement
                ).value

                if (!originCity || !destinationCity || !cost) {
                    Swal.showValidationMessage('Todos los campos son requeridos')
                    return false
                }

                return {
                    originCity,
                    destinationCity,
                    cost: parseFloat(cost),
                    intermediateStops: intermediateStops
                        .split(',')
                        .map((s) => s.trim()),
                    isDirectRoute: intermediateStops.length === 0,
                }
            },
        })

        if (formValues) {
            onSave(formValues)
        }
    }

    return (
        <div>
            <button onClick={showForm}>Agregar Nueva Ruta</button>
        </div>
    )
}

export default RouteFrom
