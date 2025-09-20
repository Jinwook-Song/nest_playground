import { Controller, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async countMessages(@Query('chatId') chatId: string) {
    return this.messagesService.countMessages(chatId);
  }
}
