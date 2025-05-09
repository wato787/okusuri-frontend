import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>カレンダー</h1>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-blue-500' />
            <span>記録カレンダー</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 text-muted-foreground'>
            <p>カレンダー機能は開発中です</p>
            <p className='mt-2'>今後のアップデートをお待ちください</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
