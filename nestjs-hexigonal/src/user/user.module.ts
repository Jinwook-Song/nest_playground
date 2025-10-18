import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepository } from './infrastructure/adapters/in-memory-user.repository';
import { UserController } from './presentation/user.controller';
import { CommandHandlers } from './application/commands/handlers';
import { QueryHandlers } from './application/queries/handlers';
import { EMAIL_NOTIFICATION_SERVICE } from './application/ports/email-notification.port';
import { ConsoleEmailAdapter } from './infrastructure/adapters/console-email.adapter';
import { EventHandlers } from './application/events';

@Module({
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: EMAIL_NOTIFICATION_SERVICE,
      useClass: ConsoleEmailAdapter,
    },
  ],
})
export class UserModule {}
