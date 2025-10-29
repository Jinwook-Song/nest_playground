import { Ctx, Input, Mutation, Query, Router } from '@mguay/nestjs-trpc';
import { AuthTRPCMiddleware } from 'src/auth/auth-trpc.middleware';
import { UseMiddlewares } from '@mguay/nestjs-trpc';
import { CommentsService } from './comments.service';
import {
  commentSchema,
  CreateCommentInput,
  createCommentSchema,
  DeleteCommentInput,
  deleteCommentSchema,
  GetCommentsInput,
  getCommentsSchema,
} from '@repo/trpc/schemas';
import { AppContext } from 'src/app.context.interface';
import z from 'zod';

@Router()
@UseMiddlewares(AuthTRPCMiddleware)
export class CommentsRouter {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation({ input: createCommentSchema })
  async createComment(
    @Input() createCommentInput: CreateCommentInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.commentsService.create(createCommentInput, ctx.user.id);
  }

  @Query({ input: getCommentsSchema, output: z.array(commentSchema) })
  async findByPostId(@Input() getCommentsInput: GetCommentsInput) {
    return this.commentsService.findByPostId(getCommentsInput.postId);
  }

  @Mutation({ input: deleteCommentSchema })
  async deleteComment(
    @Input() deleteCommentInput: DeleteCommentInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.commentsService.delete(
      deleteCommentInput.commentId,
      ctx.user.id,
    );
  }
}
