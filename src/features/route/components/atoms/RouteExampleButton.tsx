import LoadExampleButton from "@/shared/components/atoms/LoadExampleButton"
import { useRouteController } from "../../hooks/useRouteController"

function RouteExampleButton() {
    const { loadExample } = useRouteController()

  return (
    <LoadExampleButton onClick={loadExample}
      ariaLabel="Cargar rutas de ejemplo"
      icon="🗺️"
      customColor="#3B82F6"
    >
      Cargar rutas de ejemplo
    </LoadExampleButton>
  )
}

export default RouteExampleButton
