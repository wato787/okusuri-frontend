import { MedicationTracker } from './_components/MedicationTracker';
import NotificationSettingContent from './_components/NotificationSettingContent';
import { getNotificationSetting } from './fetcher';

const DashBoard = async () => {
  const notificationSetting = await getNotificationSetting();

  return (
    <div>
      <NotificationSettingContent notificationSetting={notificationSetting} />
      <MedicationTracker />
    </div>
  );
};

export default DashBoard;
