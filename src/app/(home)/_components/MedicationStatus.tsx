import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Calendar,
  Clock,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

type MedicationStatusProps = {
  dayCount: number;
  consecutiveBleedingDays: number;
  isRestPeriod: boolean;
  restDaysLeft: number;
  nextAction: string;
};

export function MedicationStatus({
  dayCount,
  consecutiveBleedingDays,
  isRestPeriod,
  restDaysLeft,
  nextAction,
}: MedicationStatusProps) {
  // 28日周期を想定
  const cycleProgress = (dayCount / 28) * 100;

  return (
    <Card className='overflow-hidden'>
      <div
        className={cn(
          'py-3 px-4 text-white font-medium',
          isRestPeriod ? 'bg-amber-500' : 'bg-teal-600'
        )}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            {isRestPeriod ? (
              <PauseCircle className='mr-2 h-5 w-5' />
            ) : (
              <PlayCircle className='mr-2 h-5 w-5' />
            )}
            <span>{isRestPeriod ? '休薬期間中' : '服用期間中'}</span>
          </div>
          <div className='text-sm'>
            {isRestPeriod ? `残り${restDaysLeft}日` : `${dayCount}日目`}
          </div>
        </div>
      </div>

      <CardContent className='p-4'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center text-sm text-muted-foreground'>
              <Calendar className='mr-2 h-4 w-4' />
              <span>服用サイクル</span>
            </div>
            <div className='text-sm font-medium'>{dayCount}/28日</div>
          </div>

          <Progress value={cycleProgress} className='h-2' />

          {consecutiveBleedingDays > 0 && (
            <div className='flex items-center mt-4 text-sm'>
              <AlertCircle
                className={cn(
                  'mr-2 h-4 w-4',
                  consecutiveBleedingDays >= 3
                    ? 'text-red-500'
                    : 'text-amber-500'
                )}
              />
              <span>
                {consecutiveBleedingDays >= 3
                  ? '3日連続で出血があります。休薬期間に入ってください。'
                  : `連続${consecutiveBleedingDays}日間出血があります。`}
              </span>
            </div>
          )}

          <div className='flex items-center mt-2'>
            <Clock className='mr-2 h-5 w-5 text-blue-500' />
            <span className='font-medium'>{nextAction}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
