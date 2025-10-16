import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserUseCase,
} from '../domain/use-cases/create-user.use-case';
import { User } from '../domain/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(createUserDto);

    return this.mapUserToResponse(user);
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpatedAt(),
      accountAge: user.getAccountAge(),
    };
  }
}
