import Image from 'next/image';
import { Card } from '../ui/card';

interface Story {
  id: string;
  username: string;
  avatar: string;
}

const mockStories: Story[] = [
  {
    id: '1',
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=60&h=60&facepad=2',
  },

  {
    id: '2',
    username: 'jane_doe',
    avatar:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=60&h=60&facepad=2',
  },

  {
    id: '3',
    username: 'jim_beam',
    avatar:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=60&h=60&facepad=2',
  },

  {
    id: '4',
    username: 'jill_bean',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=60&h=60&facepad=2',
  },

  {
    id: '5',
    username: 'jack_smith',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=60&h=60&facepad=2',
  },
];

export function Stories() {
  return (
    <Card className='p-4'>
      <div className='flex space-x-4 overflow-x-auto scrollbar-hide pb-2'>
        {mockStories.map((story) => (
          <div
            key={story.id}
            className='flex flex-col items-center space-y-1 flex-shrink-0'
          >
            <div className='relative'>
              <div className='p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 bg-gray-200'>
                <Image
                  src={story.avatar}
                  alt={story.username}
                  width={64}
                  height={64}
                  className='w-16 h-16 rounded-full object-cover border-2 border-white'
                />
              </div>
            </div>
            <span
              className='text-xs text-center w-16 truncate'
              title={story.username}
            >
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
