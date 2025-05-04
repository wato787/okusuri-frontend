import NotificationSettingContent from './_components/NotificationSettingContent';
import { getNotificationSetting } from './fetcher';

const DashBoard = async () => {
  const notificationSetting = await getNotificationSetting();

  return (
    <div>
      <NotificationSettingContent notificationSetting={notificationSetting} />
    </div>
  );
};

export default DashBoard;
