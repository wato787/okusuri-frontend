import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, PauseCircle } from 'lucide-react';

type RestPeriodStatusProps = {
  restDaysLeft: number;
  totalRestDays: number;
};

export function RestPeriodStatus({
  restDaysLeft,
  totalRestDays,
}: RestPeriodStatusProps) {
  // 休薬期間の進捗
  const restProgress = ((totalRestDays - restDaysLeft) / totalRestDays) * 100;

  return (
    <Card className='overflow-hidden'>
      <div className='py-3 px-4 bg-amber-500 text-white font-medium'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <PauseCircle className='mr-2 h-5 w-5' />
            <span>休薬期間中</span>
          </div>
          <div className='text-sm'>残り{restDaysLeft}日</div>
        </div>
      </div>

      <CardContent className='p-4'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center text-sm text-muted-foreground'>
              <Calendar className='mr-2 h-4 w-4' />
              <span>休薬期間</span>
            </div>
            <div className='text-sm font-medium'>
              {totalRestDays - restDaysLeft}/{totalRestDays}日
            </div>
          </div>

          <Progress value={restProgress} className='h-2' />

          <div className='flex items-center mt-2'>
            <Clock className='mr-2 h-5 w-5 text-blue-500' />
            <span className='font-medium'>
              {restDaysLeft === 0
                ? '明日から服用を再開してください'
                : `${restDaysLeft}日後に服用を再開してください`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
