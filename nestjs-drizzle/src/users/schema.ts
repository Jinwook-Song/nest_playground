import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { posts } from 'src/posts/schema';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const userRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  profile: one(profile, {
    fields: [users.id],
    references: [profile.userId],
  }),
}));

export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull().default(0),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(users, {
    fields: [profile.userId],
    references: [users.id],
  }),
}));
