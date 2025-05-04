'use client';

import { Button } from '@/components/ui/button';
import { messaging } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';
import toast from 'react-hot-toast';
import { registerNotificationSetting } from '../action';
import {
  type NotificationSetting,
  registerNotificationSettingSchama,
} from '../schema';

type Props = {
  notificationSetting?: NotificationSetting;
};

const NotificationSettingContent = ({ notificationSetting }: Props) => {
  const handleClick = async () => {
    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    const permission = await Notification.requestPermission();
    const isEnabled = permission === 'granted';

    const vaidatedFields = registerNotificationSettingSchama.safeParse({
      fcmToken,
      isEnabled,
      platform: 'web',
    });
    if (!vaidatedFields.success) {
      console.error(vaidatedFields.error);
      return;
    }
    const res = await registerNotificationSetting(vaidatedFields.data);

    if (!res.success) return toast.error('通知の設定に失敗しました');
    toast.success('通知の設定が完了しました');
  };
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Button disabled={!!notificationSetting} onClick={handleClick}>
        PUSH通知を受け取る
      </Button>
    </div>
  );
};

export default NotificationSettingContent;
