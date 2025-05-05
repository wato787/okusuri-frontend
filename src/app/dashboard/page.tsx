import { MedicationTracker } from './_components/MedicationTracker';

const DashBoard = async () => {
  // TODO:UI修正
  // const notificationSetting = await getNotificationSetting();

  return (
    <div className='flex flex-col items-center justify-center h-screen p-4'>
      {/* <NotificationSettingContent notificationSetting={notificationSetting} /> */}
      <MedicationTracker />
    </div>
  );
};

export default DashBoard;
