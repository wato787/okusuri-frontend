'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { useTransition } from 'react';

import { messaging } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';
import toast from 'react-hot-toast';

import { registerNotificationSetting } from '../action';
import {
  type NotificationSetting as NotificationSettingType,
  registerNotificationSettingSchama,
} from '../schema';

type Props = {
  notificationSetting?: NotificationSettingType;
};

export function NotificationSetting({ notificationSetting }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleNotificationSetting = () => {
    startTransition(async () => {
      try {
        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        const permission = await Notification.requestPermission();
        const isEnabled = permission === 'granted';

        const validatedFields = registerNotificationSettingSchama.safeParse({
          fcmToken,
          isEnabled,
          platform: 'web',
        });

        if (!validatedFields.success) {
          console.error(validatedFields.error);
          toast.error('通知の設定に失敗しました');
          return;
        }

        const res = await registerNotificationSetting(validatedFields.data);

        if (!res.success) {
          toast.error('通知の設定に失敗しました');
          return;
        }

        toast.success('通知の設定が完了しました');
      } catch (error) {
        console.error(error);
        toast.error('通知の設定に失敗しました');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='h-5 w-5 text-amber-500' />
          <span>通知設定</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-sm text-muted-foreground mb-6'>
          {notificationSetting
            ? '通知設定が完了しています。お薬の服用時間になると通知が届きます。'
            : 'お薬の服用時間になると通知でお知らせします。下のボタンから通知を有効にしてください。'}
        </div>

        <Button
          variant={notificationSetting ? 'outline' : 'default'}
          className='w-full h-12 text-lg font-medium'
          onClick={handleNotificationSetting}
          disabled={!!notificationSetting || isPending}
        >
          {isPending ? (
            '設定中...'
          ) : notificationSetting ? (
            <>
              <BellOff className='mr-2 h-5 w-5' />
              通知設定済み
            </>
          ) : (
            <>
              <Bell className='mr-2 h-5 w-5' />
              PUSH通知を有効にする
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
