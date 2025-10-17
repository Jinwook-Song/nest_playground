'use client';
import Image from 'next/image';
import { Post } from '@repo/trpc/schemas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, UserIcon } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { cn } from '@/lib/utils';

interface FeedProps {
  posts: Post[];
  onLikePost: (postId: number) => void;
}

export default function Feed({ posts, onLikePost }: FeedProps) {
  const renderUserAvatar = (avatar: string, username: string) => {
    const avatarUrl = getImageUrl(avatar);

    if (avatarUrl) {
      return (
        <Image
          src={avatarUrl}
          alt={username}
          width={64}
          height={64}
          className='w-8 h-8 rounded-full'
        />
      );
    }

    return (
      <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center'>
        <UserIcon className='w-4 h-4 text-muted-foreground' />
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {posts.map((post) => (
        <Card key={post.id} className='overflow-hidden'>
          {/* Post Header */}
          <div className='flex items-center justify-between p-4'>
            <div className='flex items-center space-x-3'>
              {renderUserAvatar(post.user.avatar, post.user.username)}
              <span className='font-semibold text-sm'>
                {post.user.username}
              </span>
            </div>
          </div>

          {/* Post Image */}
          <div className='aspect-square relative'>
            <Image
              src={getImageUrl(post.image)}
              alt={post.caption}
              className='object-cover'
              fill
            />
          </div>

          {/* Post Content */}
          <div className='p-4 space-y-3'>
            {/* Action Buttons */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onLikePost(post.id)}
                  className='p-0 h-auto'
                >
                  <Heart
                    className={cn(
                      'w-6 h-6',
                      post.isLiked
                        ? 'text-red-500 fill-red-500'
                        : 'text-foreground',
                    )}
                  />
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

            {/* Likes Count */}
            <div className='text-sm font-semibold'>{post.likes} likes</div>

            {/* Caption */}
            <div className='text-sm'>
              <span className='font-semibold'>{post.user.username} </span>
              {post.caption}
            </div>

            {/* Comments Count */}
            {post.comments > 0 && (
              <div className='text-sm text-muted-foreground'>
                View all {post.comments} comments
              </div>
            )}

            {/* Post Date */}
            <div className='text-xs text-muted-foreground uppercase'>
              {formatDate(post.createdAt)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
