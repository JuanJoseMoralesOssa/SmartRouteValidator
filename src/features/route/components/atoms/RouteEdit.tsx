import { useModal } from '@/shared/hooks/useModal'
import RouteModalForm from '../atoms/RouteModalForm'
import useRouteStore from '../../stores/useRouteStore'
import { useRouteController } from '../../hooks/useRouteController'
import { Route } from '@/shared/types/entities/Route'
import ActionButton from '@/shared/components/atoms/ActionButton'

interface RouteEditProps {
  route: Route
  onEditRoute: (route: Route) => void
}

const RouteEdit = ({ route, onEditRoute }: RouteEditProps) => {
  const { isOpen, openModal, closeModal } = useModal()
  const { item } = useRouteStore()
  const { handleUpdate } = useRouteController()

  const handleClick = () => {
    onEditRoute(route)
    openModal()
  }

  return (
    <>
      <ActionButton
        onClick={handleClick}
        customColor={route.color}
        icon="✏️"
        aria-label={`Editar ruta de ${route.origin?.name} a ${route.destiny?.name}`}
      >
        Editar
      </ActionButton>
      <RouteModalForm
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleUpdate}
        initialData={item ?? undefined}
      />
    </>
  )
}

export default RouteEdit
