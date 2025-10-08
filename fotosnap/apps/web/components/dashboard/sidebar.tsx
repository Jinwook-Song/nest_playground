'use client';

import Image from 'next/image';
import { Card } from '../ui/card';
import { authClient } from '@/lib/auth/client';
import { ThemeToggle } from '../theme/theme-toggle';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  return (
    <div className='space-y-6'>
      <Card className='p-4'>
        <div className='flex items-center space-x-3 mb-4'>
          <Image
            src='https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=60&h=60&facepad=2'
            alt='User Avatar'
            width={60}
            height={60}
            className='w-14 h-14 rounded-full'
          />
          <div className='flex-1 min-w-0'>
            <div className='font-semibold truncate'>{session?.user?.email}</div>
            <div className='text-sm text-muted-foreground truncate'>
              {session?.user?.name}
            </div>
          </div>
          <div className='flex items-center gap-1 sm:gap-2 shrink-0'>
            <ThemeToggle />
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'
              onClick={handleLogout}
            >
              <LogOut className='h-4 w-4' />
              <span className='sr-only'>Logout</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
