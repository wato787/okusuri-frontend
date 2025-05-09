import { MedicationTracker } from './_components/MedicationTracker';

const Home = async () => {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>お薬管理</h1>
      <MedicationTracker />
    </div>
  );
};

export default Home;
