import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema';
import { relations } from 'drizzle-orm';

export const post = pgTable('post', {
  id: serial('id').primaryKey(),
  image: text('image').notNull(),
  caption: text('caption').notNull(),
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const postRelations = relations(post, ({ one }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));
