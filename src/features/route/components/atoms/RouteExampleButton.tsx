import LoadExampleButton from "@/shared/components/atoms/LoadExampleButton"
import { useRouteController } from "../../hooks/useRouteController"

function RouteExampleButton() {
  const { loadExample } = useRouteController({
    enableVisualization: true,
    visualizationDelay: 800 // 800ms para que sea más rápido al cargar múltiples ejemplos
  })

  return (
    <LoadExampleButton onClick={loadExample}
      ariaLabel="Load example routes"
      icon="🗺️"
      customColor="#3B82F6"
    >
      Load example routes
    </LoadExampleButton>
  )
}

export default RouteExampleButton
