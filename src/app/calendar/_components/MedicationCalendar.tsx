'use client';

import { registerMedicationLog } from '@/app/(home)/action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Check, ChevronLeft, ChevronRight, Droplet, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';

import toast from 'react-hot-toast';
import type { MedicationLog } from '../schema';

type MedicationCalendarProps = {
  logs: MedicationLog[];
};

export function MedicationCalendar({ logs }: MedicationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

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

  // 記録を追加する処理
  const handleAddRecord = (hasBleeding: boolean) => {
    if (!selectedDay) return;

    startTransition(async () => {
      try {
        // 選択された日付の0時0分0秒に設定
        const recordDate = new Date(selectedDay);
        recordDate.setHours(0, 0, 0, 0);

        await registerMedicationLog({
          hasBleeding,
        });

        toast.success('記録が完了しました');
      } catch (error) {
        console.error('記録の追加に失敗しました', error);
        toast.error('記録の追加に失敗しました');
      }
    });
  };

  // 曜日の配列
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // 未来の日付かどうかを判定
  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

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
              const isFuture = isFutureDate(day);

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
                    dayLog?.hasBleeding && 'bg-red-100 dark:bg-red-900/30',
                    isFuture && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => !isFuture && handleDayClick(day)}
                  disabled={isFuture}
                  aria-label={`${format(day, 'yyyy年MM月dd日')}${
                    dayLog
                      ? dayLog.hasBleeding
                        ? '、出血あり'
                        : '、正常に服用'
                      : ''
                  }${isFuture ? '、未来の日付' : ''}`}
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
          <CardHeader className='pb-2'>
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
              <div className='text-center py-4'>
                <div className='text-muted-foreground mb-4'>
                  この日の記録はありません
                </div>
                <div className='flex items-center justify-center'>
                  <Plus className='h-5 w-5 text-blue-500 mr-2' />
                  <span className='font-medium'>記録を追加しますか？</span>
                </div>
              </div>
            )}
          </CardContent>
          {!selectedDayLog && !isFutureDate(selectedDay) && (
            <CardFooter className='flex justify-center gap-4 pt-0'>
              <Button
                variant='outline'
                className='flex-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800'
                onClick={() => handleAddRecord(false)}
                disabled={isPending}
              >
                <Check className='mr-2 h-4 w-4 text-green-500' />
                正常に服用
              </Button>
              <Button
                variant='outline'
                className='flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800'
                onClick={() => handleAddRecord(true)}
                disabled={isPending}
              >
                <Droplet className='mr-2 h-4 w-4 text-red-500' />
                出血あり
              </Button>
            </CardFooter>
          )}
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
