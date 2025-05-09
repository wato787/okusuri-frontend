import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>プロフィール</h1>

      <Card>
        <CardHeader>
          <CardTitle>ユーザー情報</CardTitle>
          <CardDescription>あなたの情報を更新できます</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>名前</Label>
            <Input id='name' placeholder='山田 花子' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>メールアドレス</Label>
            <Input id='email' type='email' placeholder='your@email.com' />
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full'>保存する</Button>
        </CardFooter>
      </Card>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>お薬情報</CardTitle>
          <CardDescription>
            服用しているお薬の情報を設定できます
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='medication-name'>お薬の名前</Label>
            <Input
              id='medication-name'
              placeholder='例：ピル、ホルモン剤など'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='medication-time'>服用時間</Label>
            <Input id='medication-time' type='time' />
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full'>保存する</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
