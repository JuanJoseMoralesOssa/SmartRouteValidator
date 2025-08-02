import { Route } from "@/shared/types/entities/Route";
import StatIcon from "../StatIcon";
import StatCard from "./../StatCard";

interface WithScalesCardProps {
  routes?: Route[] | null;
}

function WithScalesCard({ routes }: Readonly<WithScalesCardProps>) {
  return (

    <StatCard>
      <div>
        <p className='text-sm font-medium text-gray-600'>Con Escalas</p>
        <p className='text-2xl font-bold text-orange-600'>
          {routes?.filter(r => !r.isDirectRoute).length || 0}
        </p>
      </div>
      <StatIcon className="bg-orange-100">🔄</StatIcon>
    </StatCard>
  )
}

export default WithScalesCard
