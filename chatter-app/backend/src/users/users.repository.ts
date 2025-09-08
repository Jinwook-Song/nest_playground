import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { UserDocument } from './entities/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
