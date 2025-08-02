import { useModal } from '@/shared/hooks/useModal'
import RouteModalForm from '../atoms/RouteModalForm'
import useRouteStore from '../../stores/useRouteStore'
import { useRouteController } from '../../hooks/useRouteController'

const RouteCreate = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const { item } = useRouteStore()
    const { handleCreate } = useRouteController()

    return (
        <div>
            <button onClick={openModal} className="btn-primary">
                Agregar Nueva Ruta
            </button>
            <RouteModalForm
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={handleCreate}
                initialData={item ?? undefined}
            />
        </div>
    )
}

export default RouteCreate
