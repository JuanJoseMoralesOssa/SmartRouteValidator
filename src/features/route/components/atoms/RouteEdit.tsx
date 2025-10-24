import { useModal } from '@/shared/hooks/useModal'
import RouteModalForm from '../atoms/RouteModalForm'
import { useRouteController } from '../../hooks/useRouteController'
import { Route } from '@/shared/types/entities/Route'
import ActionButton from '@/shared/components/atoms/ActionButton'

interface RouteEditProps {
  route: Route
  onEditRoute: (route: Route) => void
}

const RouteEdit = ({ route, onEditRoute }: RouteEditProps) => {
  const { isOpen, openModal, closeModal } = useModal()
  const { handleUpdate } = useRouteController({
    enableVisualization: true,
    visualizationDelay: 2000 // 2000ms entre cada paso para mejor visualización
  })

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
        initialData={route ?? undefined}
      />
    </>
  )
}

export default RouteEdit
