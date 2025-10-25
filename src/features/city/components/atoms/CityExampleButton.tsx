import LoadExampleButton from "@/shared/components/atoms/LoadExampleButton"
import { useCityController } from "../../hooks/useCityController"

function CityExampleButton() {
  const { loadExample } = useCityController()
  return (
    <LoadExampleButton onClick={loadExample}
      ariaLabel="Load example cities"
      icon="🌆"
      customColor="#4F46E5"
    >
      Load example cities
    </LoadExampleButton>
  )
}

export default CityExampleButton
