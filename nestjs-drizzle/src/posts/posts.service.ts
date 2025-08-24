import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/posts/schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { eq } from 'drizzle-orm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getPosts() {
    return this.db.query.posts.findMany({
      with: {
        user: true,
        categories: true,
      },
    });
  }

  async getPost(id: number) {
    return this.db.query.posts.findFirst({
      where: eq(schema.posts.id, id),
      with: {
        user: true,
        categories: true,
      },
    });
  }

  async createPost(post: typeof schema.posts.$inferInsert, category?: string) {
    await this.db.transaction(async (tx) => {
      const posts = await tx
        .insert(schema.posts)
        .values(post)
        .returning({ id: schema.posts.id });
      if (category) {
        const { id: categoryId } = await this.categoriesService //
          .createCategory({ name: category }, tx);
        await this.categoriesService //
          .addToPost({ postId: posts[0].id, categoryId }, tx);
      }
    });
  }

  async updatePost(id: number, post: typeof schema.posts.$inferInsert) {
    return this.db
      .update(schema.posts)
      .set(post)
      .where(eq(schema.posts.id, id))
      .returning();
  }
}
