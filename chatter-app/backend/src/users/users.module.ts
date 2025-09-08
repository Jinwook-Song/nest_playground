import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './entities/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
