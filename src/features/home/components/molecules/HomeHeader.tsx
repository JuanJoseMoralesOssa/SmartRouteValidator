import { Route } from '@/shared/types/entities/Route';
import StatisticsCards from '../atoms/staticsCards/StatisticsCards';
import Header from '@/shared/components/atoms/Header';

interface HeaderProps {
  routes?: Route[] | null;
}

function HomeHeader({ routes }: Readonly<HeaderProps>) {
  return (
    <div className='text-center space-y-4'>
      <Header />
      <StatisticsCards routes={routes} />
    </div>
  )
}

export default HomeHeader
