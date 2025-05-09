import { Hamburger } from './Hamburger';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur'>
      <div className='container flex h-14 items-center justify-between'>
        <div className='font-medium'>おくすり管理</div>
        <Hamburger />
      </div>
    </header>
  );
}
