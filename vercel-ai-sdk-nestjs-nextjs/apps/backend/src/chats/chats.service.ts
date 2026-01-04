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
    const modelMessages: ModelMessage[] = [...convertToModelMessages(messages)];
    const result = streamText({
      model,
      messages: modelMessages,
      tools: this.toolsService.getAllTools(),
    });

    result.pipeUIMessageStreamToResponse(res);
  }
}
