import CityCreate from "@/features/city/components/atoms/CityCreate"
import CityExampleButton from "@/features/city/components/atoms/CityExampleButton"
import RouteCreate from "@/features/route/components/atoms/RouteCreate"
import RouteExampleButton from "@/features/route/components/atoms/RouteExampleButton"

function ActionSection() {
  return (
    <div className='flex justify-center items-center space-x-4 '>
      <RouteCreate />
      <CityCreate />
      <CityExampleButton />
      <RouteExampleButton />
    </div>
  )
}

export default ActionSection
