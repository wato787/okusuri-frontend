import { MedicationTracker } from './_components/MedicationTracker';

const DashBoard = async () => {
  // const notificationSetting = await getNotificationSetting();

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {/* <NotificationSettingContent notificationSetting={notificationSetting} /> */}
      <MedicationTracker />
    </div>
  );
};

export default DashBoard;
