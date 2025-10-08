'use client';

import Image from 'next/image';
import { Card } from '../ui/card';
import { authClient } from '@/lib/auth/client';
import { ThemeToggle } from '../theme/theme-toggle';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuggestedUser {
  id: string;
  username: string;
  avatar: string;
  followedBy: string;
}

const mockSuggestedUsers: SuggestedUser[] = [
  {
    id: '2',
    username: 'jane_doe',
    avatar:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=60&h=60&facepad=2',
    followedBy: 'john_doe',
  },
  {
    id: '3',
    username: 'jim_beam',
    avatar:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=60&h=60&facepad=2',
    followedBy: 'john_doe',
  },
  {
    id: '4',
    username: 'jill_bean',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=60&h=60&facepad=2',
    followedBy: 'john_doe',
  },
  {
    id: '5',
    username: 'jack_smith',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=60&h=60&facepad=2',
    followedBy: 'john_doe',
  },
  {
    id: '6',
    username: 'jess_brown',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=60&h=60&facepad=2',
    followedBy: 'john_doe',
  },
  {
    id: '7',
    username: 'mike_white',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=60&h=60&facepad=2',
    followedBy: 'john_doe',
  },
];

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

      <Card className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-muted-foreground'>
            Suggestions for you
          </h3>
        </div>

        <div className='space-y-3'>
          {mockSuggestedUsers.map((user) => (
            <div key={user.id} className='flex items-center space-x-3'>
              <Image
                src={user.avatar}
                alt={user.username}
                width={40}
                height={40}
                className='w-8 h-8 rounded-full'
              />
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-sm'>{user.username}</div>
                {user.followedBy && (
                  <div className='text-xs text-muted-foreground'>
                    Followed by {user.followedBy}
                  </div>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='text-primary hover:text-primary/90 text-xs'
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
