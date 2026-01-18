import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from 'src/database/database.module';
import { like, post } from './schemas/schema';
import { UsersService } from 'src/auth/users/users.service';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    await this.db.insert(post).values({
      userId,
      caption: createPostInput.caption,
      image: createPostInput.image,
    });
  }

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const posts = await this.db.query.post.findMany({
      with: { user: true, likes: true, comments: true },
      where: postUserId ? eq(post.userId, postUserId) : undefined,
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((post) => ({
      id: post.id,
      user: {
        username: post.user.name,
        avatar: post.user.image || '',
      },
      image: post.image,
      likes: post.likes.length,
      caption: post.caption,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.userId === userId),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.db.query.like.findFirst({
      where: and(eq(like.postId, postId), eq(like.userId, userId)),
    });

    if (existingLike) {
      await this.db.delete(like).where(eq(like.id, existingLike.id));
    } else {
      await this.db.insert(like).values({ postId, userId });
    }
  }
}
