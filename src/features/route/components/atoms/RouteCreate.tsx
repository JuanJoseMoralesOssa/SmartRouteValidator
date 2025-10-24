import { useModal } from '@/shared/hooks/useModal'
import RouteModalForm from '../atoms/RouteModalForm'
import { useRouteController } from '../../hooks/useRouteController'
import ActionButton from '@/shared/components/atoms/ActionButton'

const RouteCreate = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const { handleCreate } = useRouteController({
        enableVisualization: true,
        visualizationDelay: 2000 // 2000ms entre cada paso para mejor visualización
    })
    return (
        <div>
            <ActionButton
                onClick={openModal}
                aria-label="Crear nueva ruta"
                icon="🛣️"
            >
                Crear Ruta
            </ActionButton>
            <RouteModalForm
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={handleCreate}
                initialData={undefined}
            />
        </div>
    )
}

export default RouteCreate
