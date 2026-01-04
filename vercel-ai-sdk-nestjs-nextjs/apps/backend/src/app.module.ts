import { Module } from '@nestjs/common';
import { ChatsModule } from './chats/chats.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
