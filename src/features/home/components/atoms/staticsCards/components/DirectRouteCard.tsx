import { Route } from "@/shared/types/entities/Route";
import StatCard from "../StatCard";
import StatIcon from "../StatIcon";

interface DirectRouteCardProps {
  routes?: Route[] | null;
}

function DirectRouteCard({ routes }: Readonly<DirectRouteCardProps>) {
  return (
    <StatCard>
      <div>
        <p className='text-sm font-medium text-gray-600'>Rutas Directas</p>
        <p className='text-2xl font-bold text-green-600'>
          {routes?.filter(r => r.isDirectRoute).length || 0}
        </p>
      </div>
      <StatIcon className="bg-green-100">🚀</StatIcon>
    </StatCard>
  )
}

export default DirectRouteCard
