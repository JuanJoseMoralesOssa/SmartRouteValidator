import LoadExampleButton from "@/shared/components/atoms/LoadExampleButton"
import { useCityController } from "../../hooks/useCityController"

function CityExampleButton() {
  const { loadExample } = useCityController()
  return (
    <LoadExampleButton onClick={loadExample}
      ariaLabel="Cargar ciudades de ejemplo"
      icon="🌆"
      customColor="#4F46E5"
    >
      Cargar ciudades de ejemplo
    </LoadExampleButton>
  )
}

export default CityExampleButton
