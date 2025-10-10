import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from './schemas/trpc.schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from 'src/database/database.module';
import { post } from './schemas/schema';
import { UsersService } from 'src/auth/users/users.service';
import { desc } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    const [newPost] = await this.db
      .insert(post)
      .values({
        userId,
        caption: createPostInput.caption,
        image: createPostInput.image,
        likes: 0,
      })
      .returning();

    return this.formatPostResponse(newPost, userId);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.db.query.post.findMany({
      with: { user: true },
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((post) => ({
      id: post.id,
      user: {
        username: post.user.name,
        avatar: '',
      },
      image: post.image,
      caption: post.caption,
      likes: post.likes ?? 0,
      comments: 0,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  }

  private async formatPostResponse(
    savedPost: typeof post.$inferSelect,
    userId: string,
  ): Promise<Post> {
    const userInfo = await this.usersService.findById(userId);

    return {
      id: savedPost.id,
      user: {
        username: userInfo.name,
        avatar: '',
      },
      image: savedPost.image,
      caption: savedPost.caption,
      likes: savedPost.likes ?? 0,
      comments: 0,
      createdAt: savedPost.createdAt.toISOString(),
      updatedAt: savedPost.updatedAt.toISOString(),
    };
  }
}
