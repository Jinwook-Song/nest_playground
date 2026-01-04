import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ToolsService } from './tools.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ToolsService],
})
export class ChatsModule {}
