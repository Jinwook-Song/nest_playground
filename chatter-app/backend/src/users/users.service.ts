import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/common/s3/s3.service';
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from './users.constants';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async uploadProfileAvatar(file: Buffer, userId: string) {
    await this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: this.getUserImageUrl(userId),
      file,
    });
  }

  async create(createUserInput: CreateUserInput) {
    try {
      return this.toEntity(
        await this.usersRepository.create({
          ...createUserInput,
          password: await this.hashPassword(createUserInput.password),
        }),
      );
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return (await this.usersRepository.find({})).map(this.toEntity);
  }

  async findOne(_id: string) {
    return this.toEntity(await this.usersRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    return this.toEntity(
      await this.usersRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...updateUserInput,
            ...(updateUserInput.password && {
              password: await this.hashPassword(updateUserInput.password),
            }),
          },
        },
      ),
    );
  }

  async remove(_id: string) {
    return this.toEntity(await this.usersRepository.findOneAndDelete({ _id }));
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.toEntity(user);
  }

  toEntity(userDocument: UserDocument): User {
    const user = {
      ...userDocument,
      imageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        this.getUserImageUrl(userDocument._id.toHexString()),
      ),
    };

    // @ts-ignore
    delete user.password;
    return user;
  }

  private getUserImageUrl(userId: string) {
    return `${userId}.${USERS_IMAGE_FILE_EXTENSION}`;
  }
}
