import { Injectable } from '@nestjs/common';
import {
  convertToModelMessages,
  ModelMessage,
  streamText,
  UIMessage,
} from 'ai';
import { Response } from 'express';
import { ToolsService } from './tools.service';

@Injectable()
export class ChatsService {
  constructor(private readonly toolsService: ToolsService) {}

  async chat(messages: UIMessage[], model: string, res: Response) {
    const modelMessages: ModelMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...convertToModelMessages(messages),
    ];
    const result = streamText({
      model,
      messages: modelMessages,
      tools: this.toolsService.getAllTools(),
    });

    result.pipeUIMessageStreamToResponse(res);
  }

  private getSystemPrompt() {
    return 'You are a generic chat bot that can answer questions and help with tasks.';
  }
}
