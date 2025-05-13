import { MedicationStatus } from './_components/MedicationStatus';
import { MedicationTracker } from './_components/MedicationTracker';
import { RestPeriodStatus } from './_components/RestPeriodStatus';

const Home = async () => {
  // ダミーデータ - 実際のアプリでは状態管理やAPIから取得
  const medicationData = {
    currentStreak: 12, // 現在の服用日数
    consecutiveBleedingDays: 0, // 連続出血日数
    isRestPeriod: false, // 休薬期間中かどうか
    restDaysLeft: 0, // 休薬期間の残り日数
  };

  // 休薬期間中の場合は別のコンポーネントを表示
  if (medicationData.isRestPeriod) {
    return (
      <div className='container max-w-md mx-auto pt-6 pb-24 px-4'>
        <RestPeriodStatus
          bleedingDays={3} // 3日連続出血で休薬期間に入った
          restDaysLeft={medicationData.restDaysLeft}
          totalRestDays={4}
        />

        <div className='mt-6'>
          <MedicationTracker isRestPeriod={true} />
        </div>
      </div>
    );
  }

  return (
    <div className='container max-w-md mx-auto pt-6 pb-24 px-4'>
      <MedicationStatus
        currentStreak={medicationData.currentStreak}
        consecutiveBleedingDays={medicationData.consecutiveBleedingDays}
        isRestPeriod={medicationData.isRestPeriod}
        restDaysLeft={medicationData.restDaysLeft}
      />

      <div className='mt-6'>
        <MedicationTracker />
      </div>
    </div>
  );
};

export default Home;
