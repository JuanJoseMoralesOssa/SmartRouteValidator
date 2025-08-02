import { Route } from "@/shared/types/entities/Route";
import TotalRoutesCard from './components/TotalRoutesCard';
import DirectRouteCard from './components/DirectRouteCard';
import WithScalesCard from './components/WithScalesCard';
import AverageCostCard from './components/AverageCostCard';

interface StatisticsCardsProps {
  routes?: Route[] | null;
}

function StatisticsCards({ routes }: Readonly<StatisticsCardsProps>) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-6'>
      <TotalRoutesCard routes={routes} />
      <DirectRouteCard routes={routes} />
      <WithScalesCard routes={routes} />
      <AverageCostCard routes={routes} />
    </div>
  )
}

export default StatisticsCards
