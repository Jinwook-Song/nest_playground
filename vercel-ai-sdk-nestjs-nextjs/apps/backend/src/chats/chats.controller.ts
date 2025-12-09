import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UIMessage } from 'ai';
import { Response } from 'express';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Post()
  chat(
    @Body() body: { messages: UIMessage[]; model?: string },
    @Res() res: Response,
  ) {
    this.chatService.chat(body.messages, body.model, res);
  }
}
