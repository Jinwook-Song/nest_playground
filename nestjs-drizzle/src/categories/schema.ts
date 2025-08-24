import { pgTable, serial, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { posts } from 'src/posts/schema';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  posts: many(postsToCategories),
}));

export const postsToCategories = pgTable(
  'posts_to_categories',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
  },
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })],
);

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postsToCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postsToCategories.categoryId],
    references: [categories.id],
  }),
}));
