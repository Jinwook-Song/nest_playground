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
  const posts = trpc.postsRouter.findAll.useQuery();
  const createPost = trpc.postsRouter.create.useMutation({});

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
            <Stories />
            <Feed posts={posts.data ?? []} />
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
