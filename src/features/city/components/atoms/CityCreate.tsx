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
                aria-label="Create new city"
                icon="🏙️"
                customColor="#006600"
            >
                Create City
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
