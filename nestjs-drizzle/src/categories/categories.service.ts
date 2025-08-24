import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase, NodePgTransaction } from 'drizzle-orm/node-postgres';
import * as schema from 'src/categories/schema';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getCategories() {
    return this.db.query.categories.findMany({
      with: {
        posts: true,
      },
    });
  }

  async createCategory(
    category: typeof schema.categories.$inferInsert,
    tx?: NodePgTransaction<any, any>,
  ) {
    return (
      await (tx ?? this.db)
        .insert(schema.categories)
        .values(category)
        .returning({ id: schema.categories.id })
    )[0];
  }

  async addToPost(
    postToCategory: typeof schema.postsToCategories.$inferInsert,
    tx?: NodePgTransaction<any, any>,
  ) {
    await (tx ?? this.db)
      .insert(schema.postsToCategories)
      .values(postToCategory);
  }
}
