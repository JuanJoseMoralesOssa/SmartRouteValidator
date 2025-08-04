import { useModal } from '@/shared/hooks/useModal'
import CityModalForm from './CityModalForm'
import ActionButton from '@/shared/components/atoms/ActionButton'
import { useCityController } from '../../hooks/useCityController'

const CityCreate = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const { handleCreate } = useCityController()
    return (
        <div>
            <ActionButton
                onClick={openModal}
                aria-label="Agregar nueva ciudad"
            >
                Agregar Nueva Ciudad
            </ActionButton>
            <CityModalForm
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={handleCreate}
                initialData={undefined}
            />
        </div>
    )
}

export default CityCreate
