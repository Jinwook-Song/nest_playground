import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './domain/use-cases/create-user.use-case';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepository } from './infrastructure/adapters/in-memory-user.repository';

@Module({
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UserModule {}
