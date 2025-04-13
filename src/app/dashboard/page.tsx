import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session);
  return <div>page</div>;
};

export default page;
