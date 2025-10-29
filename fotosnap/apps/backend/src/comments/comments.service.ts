import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from 'src/database/database.module';
import { CreateCommentInput } from '@repo/trpc/schemas';
import { comments } from './schemas/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createCommentInput: CreateCommentInput, userId: string) {
    await this.db.insert(comments).values({
      text: createCommentInput.text,
      postId: createCommentInput.postId,
      userId,
    });
  }

  async findByPostId(postId: number) {
    const commentsData = await this.db.query.comments.findMany({
      where: eq(comments.postId, postId),
      with: { user: true },
    });

    return commentsData.map((comment) => ({
      id: comment.id,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: {
        username: comment.user.name,
        avatar: comment.user.image || '',
      },
    }));
  }

  async delete(commentId: number, userId: string) {
    await this.db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
  }
}
