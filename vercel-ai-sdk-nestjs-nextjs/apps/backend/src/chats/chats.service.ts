import { Injectable } from '@nestjs/common';
import {
  convertToModelMessages,
  ModelMessage,
  streamText,
  UIMessage,
} from 'ai';
import { Response } from 'express';

@Injectable()
export class ChatsService {
  async chat(messages: UIMessage[], model: string, res: Response) {
    const modelMessages: ModelMessage[] = [...convertToModelMessages(messages)];
    const result = streamText({
      model,
      messages: modelMessages,
    });

    result.pipeUIMessageStreamToResponse(res);
  }
}
