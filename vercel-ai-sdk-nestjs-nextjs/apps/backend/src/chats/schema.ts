import { timestamp } from 'drizzle-orm/pg-core';
import { jsonb } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const chats = pgTable('chat_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('conversation_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  content: jsonb('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type StoredChat = typeof chats.$inferSelect;
export type StoredMessage = typeof messages.$inferSelect;
