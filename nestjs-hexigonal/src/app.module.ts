import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule.forRoot(), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
