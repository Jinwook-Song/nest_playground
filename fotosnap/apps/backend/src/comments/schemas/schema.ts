import { pgTable, serial, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema';
import { post } from '../../posts/schemas/schema';
import { relations } from 'drizzle-orm';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [comments.postId],
    references: [post.id],
  }),
}));
