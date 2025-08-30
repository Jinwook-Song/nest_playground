import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Body } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: CreateUserRequest) {
    await this.usersService.create(user);
  }
}
