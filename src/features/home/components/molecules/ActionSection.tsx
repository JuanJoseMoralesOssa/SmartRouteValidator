import CityCreate from "@/features/city/components/atoms/CityCreate"
import RouteCreate from "@/features/route/components/atoms/RouteCreate"

function ActionSection() {
  return (
    <div className='flex justify-center items-center space-x-4 '>
      <RouteCreate />
      <CityCreate />
    </div>
  )
}

export default ActionSection
