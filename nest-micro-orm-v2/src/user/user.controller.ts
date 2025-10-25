import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

class CreateUserDto {
  email!: string;
  name?: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto.email, dto.name);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
