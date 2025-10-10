import { z } from 'zod';

export const createPostSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  caption: z.string().min(1, 'Caption is required'),
});

export const postSchema = z.object({
  id: z.number(),
  user: z.object({
    username: z.string(),
    avatar: z.string(),
  }),
  image: z.string(),
  caption: z.string(),
  likes: z.number(),
  comments: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type Post = z.infer<typeof postSchema>;
