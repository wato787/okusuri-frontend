import { Card, CardContent } from '@/components/ui/card';
import { Clock, PauseCircle } from 'lucide-react';

type RestPeriodStatusProps = {
  bleedingDays: number; // 出血日数
};

export function RestPeriodStatus({ bleedingDays }: RestPeriodStatusProps) {
  return (
    <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
      <div className='py-4 px-5 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-medium'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <PauseCircle className='mr-2 h-5 w-5' />
            <span className='text-lg'>休薬期間中</span>
          </div>
          <div className='text-sm bg-white/20 px-3 py-1 rounded-full'>
            {bleedingDays}日目
          </div>
        </div>
      </div>

      <CardContent className='p-5'>
        <div className='space-y-5'>
          <div className='flex items-center mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
            <Clock className='mr-3 h-5 w-5 text-blue-500 flex-shrink-0' />
            <span className='font-medium'>
              出血が止まるまで休薬を続けてください
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
