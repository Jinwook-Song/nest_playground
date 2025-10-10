'use client';

import Stories from '@/components/dashboard/stories';
import Feed from '@/components/dashboard/feed';
import Sidebar from '@/components/dashboard/sidebar';
import { useState } from 'react';
import PhotoUpload from '@/components/dashboard/photo-upload';
import { Fab } from '@/components/ui/fab';
import { Plus } from 'lucide-react';

export default function Home() {
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const handlePhotoUpload = async (file: File, caption: string) => {
    console.log(file, caption);
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <Stories />
            <Feed />
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
