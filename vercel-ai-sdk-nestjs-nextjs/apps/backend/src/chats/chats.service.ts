import { Inject, Injectable } from '@nestjs/common';
import {
  convertToModelMessages,
  ModelMessage,
  streamText,
  UIMessage,
} from 'ai';
import { Response } from 'express';
import { ToolsService } from './tools.service';
import { DATABASE_CONNECTION, schema } from 'src/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class ChatsService {
  constructor(
    private readonly toolsService: ToolsService,
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async chat(message: UIMessage, res: Response, chatId: string, model: string) {
    let chat = await this.db.query.chats.findFirst({
      where: eq(schema.chats.id, chatId),
      with: {
        messages: {
          orderBy: [schema.messages.createdAt],
        },
      },
    });

    if (!chat) {
      const [newChat] = await this.db
        .insert(schema.chats)
        .values({
          id: chatId,
        })
        .returning();

      chat = { ...newChat, messages: [] };
    }

    const storedMessagesAsc = chat.messages.map((m) => m.content as UIMessage);

    const updatedAt = new Date();

    await this.db.insert(schema.messages).values({
      chatId,
      content: message,
      createdAt: updatedAt,
    });

    await this.db
      .update(schema.chats)
      .set({ updatedAt })
      .where(eq(schema.chats.id, chatId));

    const uiMessages: UIMessage[] = [...storedMessagesAsc, message];
    const originalCount = uiMessages.length;

    const modelMessages: ModelMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...convertToModelMessages(uiMessages),
    ];

    const result = streamText({
      model,
      messages: modelMessages,
      tools: this.toolsService.getAllTools(),
    });

    return result.pipeUIMessageStreamToResponse(res, {
      originalMessages: uiMessages,
      onFinish: async ({ messages }) => {
        const newMessages = messages.slice(originalCount);
        if (newMessages.length === 0) return;

        const baseTime = Date.now();

        await this.db.insert(schema.messages).values(
          newMessages.map((m, index) => ({
            chatId,
            content: m,
            createdAt: new Date(baseTime + index),
          })),
        );

        await this.db
          .update(schema.chats)
          .set({ updatedAt: new Date(baseTime + newMessages.length - 1) })
          .where(eq(schema.chats.id, chatId));
      },
    });
  }

  private getSystemPrompt() {
    return 'You are a generic chat bot that can answer questions and help with tasks.';
  }

  async getChats() {
    const chats = await this.db.query.chats.findMany({
      orderBy: [schema.chats.updatedAt],
      with: {
        messages: {
          orderBy: [desc(schema.messages.createdAt)],
          limit: 1,
        },
      },
    });

    return chats.map((chat) => {
      let snippet = 'No messages yet';
      if (chat.messages.length) {
        const message = chat.messages[0].content as UIMessage;
        const textPart = message.parts.find((p) => p.type === 'text');
        if (textPart && 'text' in textPart) {
          snippet = textPart.text.substring(0, 60);
          if (textPart.text.length > 60) snippet += '...';
        }
      }

      return {
        id: chat.id,
        updatedAt: chat.updatedAt,
        snippet,
      };
    });
  }

  async getChatById(id: string) {
    return this.db.query.chats.findFirst({
      where: eq(schema.chats.id, id),
    });
  }

  async getChatMessages(id: string) {
    const messages = await this.db.query.messages.findMany({
      where: eq(schema.messages.chatId, id),
      orderBy: [schema.messages.createdAt],
    });

    return messages.map((message) => message.content);
  }
}
