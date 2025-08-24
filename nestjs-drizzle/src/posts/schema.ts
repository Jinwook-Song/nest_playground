import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from 'src/users/schema';
import { relations } from 'drizzle-orm';
import { postsToCategories } from 'src/categories/schema';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: integer('user_id').references(() => users.id),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  categories: many(postsToCategories),
}));
