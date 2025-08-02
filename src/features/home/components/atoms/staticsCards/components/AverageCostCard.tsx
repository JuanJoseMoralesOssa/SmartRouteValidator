import { Route } from '@/shared/types/entities/Route';
import StatIcon from '../StatIcon';
import StatCard from '../StatCard';

interface AverageCostCardProps {
  routes?: Route[] | null;
}

function AverageCostCard({ routes }: Readonly<AverageCostCardProps>) {
  return (
    <StatCard>
      <div>
        <p className='text-sm font-medium text-gray-600'>Costo Promedio</p>
        <p className='text-2xl font-bold text-purple-600'>
          ${routes?.length ? (routes.reduce((sum, r) => sum + r.cost, 0) / routes.length).toFixed(0) : '0'}
        </p>
      </div>
      <StatIcon className="bg-purple-100">💰</StatIcon>
    </StatCard>
  )
}

export default AverageCostCard
