import z from 'zod';

export const createCommentSchema = z.object({
  postId: z.number().min(1, 'Post ID is required'),
  text: z.string().min(1, 'Comment is required'),
});

export const deleteCommentSchema = z.object({
  commentId: z.number().min(1, 'Comment ID is required'),
});

export const getCommentsSchema = z.object({
  postId: z.number().min(1, 'Post ID is required'),
});

export const commentSchema = z.object({
  id: z.number(),
  text: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    username: z.string(),
    avatar: z.string(),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
export type GetCommentsInput = z.infer<typeof getCommentsSchema>;
export type Comment = z.infer<typeof commentSchema>;
