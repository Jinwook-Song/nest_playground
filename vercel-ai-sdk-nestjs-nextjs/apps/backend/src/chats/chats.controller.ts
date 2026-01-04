import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UIMessage } from 'ai';
import { Response } from 'express';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Post()
  chat(
    @Res() res: Response,
    @Body() body: { message: UIMessage; id: string; model: string },
  ) {
    this.chatService.chat(body.message, res, body.id, body.model);
  }

  @Get()
  async getChats() {
    return this.chatService.getChats();
  }

  @Get(':id/messages')
  async getChatMessages(@Param('id') id: string) {
    return this.chatService.getChatMessages(id);
  }

  @Get(':id')
  async getChatById(@Param('id') id: string) {
    return this.chatService.getChatById(id);
  }
}
