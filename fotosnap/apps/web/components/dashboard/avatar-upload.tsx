'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import Image from 'next/image';
import { X } from 'lucide-react';
import FileUploadArea from '../ui/file-upload-area';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { getImageUrl } from '@/lib/image';

interface AvatarUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
  currentAvatar?: string | null;
}

export default function PhotoUpload({
  open,
  onOpenChange,
  onSubmit,
  currentAvatar,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onSubmit(selectedFile);
      clearSelection();
      onOpenChange(false);
    } catch (err) {
      console.error('Error creating avatar', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>
        {!preview ? (
          <div>
            {currentAvatar && (
              <div className='flex justify-center'>
                <Image
                  src={getImageUrl(currentAvatar)}
                  alt='Current Avatar'
                  height={64}
                  width={64}
                  className='w-24 h-24 rounded-full object-cover border-2 border-muted-foreground'
                />
              </div>
            )}
            <FileUploadArea onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex justify-center'>
              <div className='relative'>
                <Image
                  src={preview}
                  alt='Preivew'
                  height={64}
                  width={64}
                  className='w-32 h-32 rounded-full object-cover border-2 border-primary'
                />
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute -top-2 -right-2 bg-background text-foreground border border-muted-foreground rounded-full p-2'
                  onClick={clearSelection}
                >
                  <X className='w-4 h-4 text-muted-foreground' />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={clearSelection}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Update avatar'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
