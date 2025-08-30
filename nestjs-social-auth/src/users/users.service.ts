import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserRequest } from './dto/create-user.request';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserRequest) {
    await new this.userModel({
      ...user,
      password: await hash(user.password, 10),
    }).save();
  }

  async getUser(query: FilterQuery<User>) {
    const user = await this.userModel.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject();
  }

  async getUsers() {
    const users = await this.userModel.find();
    return users.map((user) => user.toObject());
  }
}
