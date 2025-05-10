import { MedicationStatus } from './_components/MedicationStatus';
import { MedicationTracker } from './_components/MedicationTracker';

const Home = async () => {
  // ダミーデータ
  const medicationData = {
    dayCount: 45, // 出血なしで連続服用した日数
    consecutiveBleedingDays: 0, // 連続出血日数
    isRestPeriod: false, // 休薬期間かどうか
    restDaysLeft: 0, // 休薬期間の残り日数
    nextAction: '服用を続けてください', // 次のアクション
  };

  return (
    <div className='container max-w-md mx-auto pt-6 pb-24 px-4'>
      <MedicationStatus
        dayCount={medicationData.dayCount}
        consecutiveBleedingDays={medicationData.consecutiveBleedingDays}
        isRestPeriod={medicationData.isRestPeriod}
        restDaysLeft={medicationData.restDaysLeft}
        nextAction={medicationData.nextAction}
      />

      <div className='mt-6'>
        <MedicationTracker />
      </div>
    </div>
  );
};

export default Home;
