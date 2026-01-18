'use client';

import Stories from '@/components/dashboard/stories';
import Feed from '@/components/dashboard/feed';
import Sidebar from '@/components/dashboard/sidebar';
import { useState } from 'react';
import PhotoUpload from '@/components/dashboard/photo-upload';
import { Fab } from '@/components/ui/fab';
import { Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';

export default function Home() {
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const utils = trpc.useUtils();
  const posts = trpc.postsRouter.findAll.useQuery({});
  const stories = trpc.storiesRouter.getStories.useQuery();
  const createPost = trpc.postsRouter.create.useMutation({
    onSuccess: () => {
      utils.postsRouter.findAll.invalidate();
    },
  });

  // Optimistic update for like functionality
  const likePost = trpc.postsRouter.likePost.useMutation({
    onMutate: ({ postId }) => {
      utils.postsRouter.findAll.setData({}, (oldPosts) => {
        if (!oldPosts) return oldPosts;

        return oldPosts.map((post) => {
          if (post.id !== postId) return post;

          const wasLiked = post.isLiked;
          return {
            ...post,
            isLiked: !wasLiked,
            likes: wasLiked ? post.likes - 1 : post.likes + 1,
          };
        });
      });
    },
  });

  const createComment = trpc.commentsRouter.createComment.useMutation({
    onSuccess: (_, variables) => {
      // refetch comments
      utils.commentsRouter.findByPostId.invalidate({
        postId: variables.postId,
      });
      // cache update
      utils.postsRouter.findAll.setData({}, (oldPosts) => {
        if (!oldPosts) return oldPosts;

        return oldPosts.map((post) => {
          if (post.id !== variables.postId) return post;

          return { ...post, comments: post.comments + 1 };
        });
      });
    },
  });

  const deleteComment = trpc.commentsRouter.deleteComment.useMutation({
    onSuccess: () => {
      utils.commentsRouter.findByPostId.invalidate();
      utils.postsRouter.findAll.invalidate();
    },
  });

  const createStory = trpc.storiesRouter.createStory.useMutation({
    onSuccess: () => {
      utils.storiesRouter.getStories.invalidate();
    },
  });

  const handleStoryUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { filename } = await response.json();
      await createStory.mutateAsync({
        image: filename,
      });
    } else {
      console.error('Failed to upload photo');
    }
  };

  const handlePhotoUpload = async (file: File, caption: string) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { filename } = await response.json();
      await createPost.mutateAsync({
        image: filename,
        caption,
      });
    } else {
      console.error('Failed to upload photo');
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <Stories
              storyGroups={stories.data ?? []}
              onStoryUpload={handleStoryUpload}
            />
            <Feed
              posts={posts.data ?? []}
              onLikePost={(postId) => likePost.mutate({ postId })}
              onAddComment={(postId, text) =>
                createComment.mutate({ postId, text })
              }
              onDeleteComment={(commentId) =>
                deleteComment.mutate({ commentId })
              }
            />
          </div>
          <div className='lg:sticky lg:top-8 lg:h-fit'>
            <Sidebar />
          </div>
        </div>
      </div>

      <PhotoUpload
        open={isPhotoUploadOpen}
        onOpenChange={setIsPhotoUploadOpen}
        onSubmit={handlePhotoUpload}
      />

      <Fab onClick={() => setIsPhotoUploadOpen(true)}>
        <Plus className='w-6 h-6' />
      </Fab>
    </div>
  );
}
