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
  const [bleedingStatus, setBleedingStatus] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = format(new Date(), 'yyyy年MM月dd日 (eee)', { locale: ja });

  const handleAction = () => {
    startTransition(async () => {
      await registerMedicationLog({ hasBleeding: !!bleedingStatus });
      toast.success('記録が完了しました');
      setBleedingStatus(null);
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
              variant={bleedingStatus === true ? 'default' : 'outline'}
              className={`h-16 text-lg ${
                bleedingStatus === true ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
              onClick={() => setBleedingStatus(true)}
            >
              <Droplet className='mr-2 h-5 w-5' />
              出血あり
            </Button>
            <Button
              variant={bleedingStatus === false ? 'default' : 'outline'}
              className={`h-16 text-lg ${
                bleedingStatus === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : ''
              }`}
              type='button'
              onClick={() => setBleedingStatus(false)}
            >
              <Check className='mr-2 h-5 w-5' />
              出血なし
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        className='w-full h-14 text-lg font-medium'
        onClick={handleAction}
        disabled={bleedingStatus === null || isPending}
      >
        {isPending ? '送信中...' : '記録を保存'}
      </Button>
    </div>
  );
}
