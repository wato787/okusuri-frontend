import { StatsOverview } from './_components/StatsOverview';
import { UsageChart } from './_components/UsageChart';
import { BleedingPatternChart } from './_components/BleedingPatternChart';
import { MonthlyStats } from './_components/MonthlyStats';

export default function StatsPage() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>統計</h1>

      <div className='space-y-6'>
        <StatsOverview />
        <UsageChart />
        <BleedingPatternChart />
        <MonthlyStats />
      </div>
    </div>
  );
}
