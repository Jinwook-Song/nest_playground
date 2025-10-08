'use client';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';

interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      username: 'john_doe',
      avatar:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=60&h=60&facepad=2',
    },
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    caption: 'Enjoying the sunny day!',
    likes: 142,
    comments: 8,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: {
      username: 'jane_doe',
      avatar:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=60&h=60&facepad=2',
    },
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    caption: 'Had a great brunch with friends.',
    likes: 98,
    comments: 5,
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    user: {
      username: 'jim_beam',
      avatar:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=60&h=60&facepad=2',
    },
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    caption: 'Exploring the city lights.',
    likes: 76,
    comments: 3,
    timestamp: '30 minutes ago',
  },
];

export default function Feed() {
  return (
    <div className='space-y-6'>
      {mockPosts.map((post) => (
        <Card key={post.id} className='overflow-hidden'>
          <div className='flex items-center justify-between p-4'>
            <div className='flex items-center space-x-3'>
              <Image
                src={post.user.avatar}
                alt={post.user.username}
                width={64}
                height={64}
                className='w-8 h-8 rounded-full'
              />
              <span className='font-semibold text-sm'>
                {post.user.username}
              </span>
            </div>
          </div>

          <div className='aspect-square relative'>
            <Image
              src={post.image}
              alt={post.caption}
              className='w-full h-full object-cover'
              width={600}
              height={600}
            />
          </div>

          <div className='p-4 space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {}}
                  className='p-0 h-auto'
                >
                  <Heart className='w-6 h-6 text-foreground' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {}}
                  className='p-0 h-auto'
                >
                  <MessageCircle className='w-6 h-6 text-foreground' />
                </Button>
              </div>
            </div>

            <div className='text-sm font-semibold'>{post.likes} likes</div>

            <div className='text-sm'>
              <span className='font-semibold'>{post.user.username} </span>
              {post.caption}
            </div>

            {post.comments > 0 && (
              <div className='text-sm text-muted-foreground'>
                View all {post.comments} comments
              </div>
            )}

            <div className='text-xs text-muted-foreground uppercase'>
              {post.timestamp}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
