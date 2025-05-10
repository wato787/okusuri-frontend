'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, Droplet } from 'lucide-react';
import { useState, useTransition } from 'react';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { registerMedicationLog } from '../action';

export function MedicationTracker() {
  const [isPending, startTransition] = useTransition();
  const [activeButton, setActiveButton] = useState<
    'bleeding' | 'normal' | null
  >(null);

  const today = format(new Date(), 'yyyy年MM月dd日 (eee)', { locale: ja });

  const handleBleedingStatus = (hasBleeding: boolean) => {
    // 既に処理中の場合は何もしない
    if (isPending) return;

    // クリックされたボタンをアクティブにする
    setActiveButton(hasBleeding ? 'bleeding' : 'normal');

    startTransition(async () => {
      try {
        await registerMedicationLog({ hasBleeding });
        toast.success('記録が完了しました');

        // 送信完了後、少し待ってからボタンのアクティブ状態をリセット
        setTimeout(() => {
          setActiveButton(null);
        }, 1000);
      } catch (error) {
        console.error('記録の保存に失敗しました', error);
        toast.error('記録の保存に失敗しました');
        setActiveButton(null);
      }
    });
  };

  return (
    <div className='space-y-6 w-full'>
      <div className='flex items-center justify-center gap-2 text-lg font-medium'>
        <Calendar className='h-5 w-5' />
        <span>{today}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Droplet className='h-5 w-5 text-red-500' />
            <span>出血状況</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <Button
              type='button'
              variant={activeButton === 'bleeding' ? 'default' : 'outline'}
              className={`h-16 text-lg relative ${
                activeButton === 'bleeding' ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
              onClick={() => handleBleedingStatus(true)}
              disabled={isPending}
            >
              {isPending && activeButton === 'bleeding' ? (
                <>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  </div>
                  <span className='opacity-0'>出血あり</span>
                </>
              ) : (
                <>
                  <Droplet className='mr-2 h-5 w-5' />
                  出血あり
                </>
              )}
            </Button>
            <Button
              type='button'
              variant={activeButton === 'normal' ? 'default' : 'outline'}
              className={`h-16 text-lg relative ${
                activeButton === 'normal'
                  ? 'bg-green-600 hover:bg-green-700'
                  : ''
              }`}
              onClick={() => handleBleedingStatus(false)}
              disabled={isPending}
            >
              {isPending && activeButton === 'normal' ? (
                <>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  </div>
                  <span className='opacity-0'>出血なし</span>
                </>
              ) : (
                <>
                  <Check className='mr-2 h-5 w-5' />
                  出血なし
                </>
              )}
            </Button>
          </div>

          {/* 送信状態の説明テキスト */}
          {isPending && (
            <div className='text-center text-sm text-muted-foreground mt-4'>
              記録を保存しています...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
