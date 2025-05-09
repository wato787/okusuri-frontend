import { SkeletonCard } from '@/components/ui/skeleton-card';

export default function SettingLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <div className='h-8 bg-muted rounded animate-pulse w-1/2 mx-auto mb-6' />
      <SkeletonCard lines={2} />
    </div>
  );
}
