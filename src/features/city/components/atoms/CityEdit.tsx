import { useModal } from '@/shared/hooks/useModal'
import CityModalForm from './CityModalForm'
import ActionButton from '@/shared/components/atoms/ActionButton'
import { City } from '@/shared/types/entities/City'
import { useCityController } from '../../hooks/useCityController'

interface CityEditProps {
  city: City
  onEditCity: (city: City) => void
}

const CityEdit = ({ city, onEditCity }: CityEditProps) => {
  const { isOpen, openModal, closeModal } = useModal()
  const { handleUpdate } = useCityController()

  const handleClick = () => {
    onEditCity(city)
    openModal()
  }

  return (
    <>
      <ActionButton
        onClick={handleClick}
        customColor={city.color}
        icon="✏️"
        aria-label={`Edit city ${city.name}`}
      >
        Edit
      </ActionButton>
      <CityModalForm
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleUpdate}
        initialData={city ?? undefined}
      />
    </>
  )
}

export default CityEdit
