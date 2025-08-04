import { useModal } from '@/shared/hooks/useModal'
import RouteModalForm from '../atoms/RouteModalForm'
import { useRouteController } from '../../hooks/useRouteController'
import ActionButton from '@/shared/components/atoms/ActionButton'

const RouteCreate = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const { handleCreate } = useRouteController()
    return (
        <div>
            <ActionButton
                onClick={openModal}
                aria-label="Agregar nueva ruta"
            >
                Agregar Nueva Ruta
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
