'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight, Droplet } from 'lucide-react';
import { useState } from 'react';
import type { MedicationLog } from '../schema';

type MedicationCalendarProps = {
  logs: MedicationLog[];
};

export function MedicationCalendar({ logs }: MedicationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  // 選択された日付のログを取得
  const selectedDayLog = selectedDay
    ? logs.find((log) => isSameDay(parseISO(log.createdAt), selectedDay))
    : undefined;

  // 月の最初と最後の日を取得
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // 週の始まりの日を取得（日曜日から始まるように調整）
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // 週の終わりの日を取得（土曜日で終わるように調整）
  const endDate = new Date(monthEnd);
  const daysToAdd = 6 - endDate.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);

  // カレンダーに表示する全ての日付を取得
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 前の月へ
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 次の月へ
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 日付をクリックしたときの処理
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  // 日付に対応するログを取得
  const getLogForDay = (day: Date) => {
    return logs.find((log) => isSameDay(parseISO(log.createdAt), day));
  };

  // 曜日の配列
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <Button
              variant='outline'
              size='icon'
              onClick={prevMonth}
              aria-label='前月へ'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <CardTitle className='text-center'>
              {format(currentMonth, 'yyyy年MM月', { locale: ja })}
            </CardTitle>
            <Button
              variant='outline'
              size='icon'
              onClick={nextMonth}
              aria-label='次月へ'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-7 gap-1'>
            {/* 曜日のヘッダー */}
            {weekdays.map((day, index) => (
              <div
                key={day}
                className={cn(
                  'text-center text-sm font-medium py-2',
                  index === 0
                    ? 'text-red-500'
                    : index === 6
                    ? 'text-blue-500'
                    : ''
                )}
              >
                {day}
              </div>
            ))}

            {/* カレンダーの日付 */}
            {calendarDays.map((day) => {
              const dayLog = getLogForDay(day);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDay && isSameDay(day, selectedDay);

              return (
                <button
                  key={day.toString()}
                  type='button'
                  className={cn(
                    'relative h-10 flex items-center justify-center text-sm rounded-md',
                    !isCurrentMonth && 'text-muted-foreground',
                    isToday && 'border border-primary',
                    isSelected && 'bg-primary/10',
                    dayLog &&
                      !dayLog.hasBleeding &&
                      'bg-green-100 dark:bg-green-900/30',
                    dayLog?.hasBleeding && 'bg-red-100 dark:bg-red-900/30'
                  )}
                  onClick={() => handleDayClick(day)}
                  aria-label={`${format(day, 'yyyy年MM月dd日')}${
                    dayLog
                      ? dayLog.hasBleeding
                        ? '、出血あり'
                        : '、正常に服用'
                      : ''
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{format(day, 'd')}</span>
                  {dayLog && (
                    <div className='absolute bottom-0.5 left-1/2 transform -translate-x-1/2'>
                      {dayLog.hasBleeding ? (
                        <Droplet className='h-3 w-3 text-red-500' />
                      ) : (
                        <Check className='h-3 w-3 text-green-500' />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDay && (
        <Card>
          <CardHeader className='-mb-3'>
            <CardTitle className='text-center'>
              {format(selectedDay, 'yyyy年MM月dd日 (eee)', { locale: ja })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayLog ? (
              <div className='flex flex-col items-center justify-center p-4'>
                <div className='flex items-center justify-center mb-2'>
                  {selectedDayLog.hasBleeding ? (
                    <div className='flex items-center text-red-500'>
                      <Droplet className='mr-2 h-5 w-5' />
                      <span>出血あり</span>
                    </div>
                  ) : (
                    <div className='flex items-center text-green-500'>
                      <Check className='mr-2 h-5 w-5' />
                      <span>正常に服用</span>
                    </div>
                  )}
                </div>
                <div className='text-sm text-muted-foreground'>
                  記録時間:{' '}
                  {format(parseISO(selectedDayLog.createdAt), 'HH:mm')}
                </div>
              </div>
            ) : (
              <div className='text-center py-4 text-muted-foreground'>
                この日の記録はありません
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className='flex justify-center space-x-4'>
        <div className='flex items-center'>
          <div className='w-3 h-3 rounded-full bg-green-500 mr-2' />
          <span className='text-sm'>正常に服用</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3 h-3 rounded-full bg-red-500 mr-2' />
          <span className='text-sm'>出血あり</span>
        </div>
      </div>
    </div>
  );
}
