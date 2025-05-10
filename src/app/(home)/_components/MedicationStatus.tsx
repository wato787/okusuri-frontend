'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Calendar, Clock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type MedicationStatusProps = {
  dayCount: number; // 出血なしで連続服用した日数
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
        <div
          className={cn(
            'py-4 px-5 text-white font-medium',
            isRestPeriod
              ? 'bg-gradient-to-r from-amber-500 to-amber-400'
              : 'bg-gradient-to-r from-teal-600 to-teal-500'
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <PlayCircle className='mr-2 h-5 w-5' />
              <span className='text-lg'>連続服用中</span>
            </div>
            <div className='text-sm bg-white/20 px-3 py-1 rounded-full'>
              {dayCount}日目
            </div>
          </div>
        </div>

        <CardContent className='p-5'>
          <div className='space-y-5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center text-sm text-muted-foreground'>
                <Calendar className='mr-2 h-4 w-4' />
                <span>連続服用日数</span>
              </div>
              <div className='text-sm font-medium'>{dayCount}日</div>
            </div>

            {consecutiveBleedingDays > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className='flex items-start mt-4 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg'
              >
                <AlertCircle
                  className={cn(
                    'mr-2 h-5 w-5 flex-shrink-0 mt-0.5',
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
              </motion.div>
            )}

            <div className='flex items-center mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
              <Clock className='mr-3 h-5 w-5 text-blue-500 flex-shrink-0' />
              <span className='font-medium'>{nextAction}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
