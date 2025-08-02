import { Route } from "@/shared/types/entities/Route"
import StatIcon from "../StatIcon";
import StatCard from "../StatCard";

interface TotalRoutesProps {
  routes?: Route[] | null;
}

function TotalRoutes({ routes }: Readonly<TotalRoutesProps>) {
  return (
    <StatCard>
      <div>
        <p className='text-sm font-medium text-gray-600'>Total Rutas</p>
        <p className='text-2xl font-bold text-blue-600'>{routes?.length || 0}</p>
      </div>
      <StatIcon className="bg-blue-100">🗺️</StatIcon>
    </StatCard>
  )
}

export default TotalRoutes
