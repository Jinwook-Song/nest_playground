import { Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Body, Get, Query } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from './schema/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: CreateUserRequest) {
    await this.usersService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User) {
    console.log(user);
    return this.usersService.getUsers();
  }
}
