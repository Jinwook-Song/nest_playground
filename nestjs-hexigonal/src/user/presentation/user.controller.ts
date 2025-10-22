import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { User } from '../domain/entities/user.entity';
import { GetUserQuery } from '../application/queries/get-user.query';
import { ListUsersQuery } from '../application/queries/list-users.query';
import { UpdateUserCommand } from '../application/commands/update-user.command';
import { DeleteUserCommand } from '../application/commands/delete-user.command';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(@Body() request: CreateUserCommand) {
    const command = new CreateUserCommand(request.name, request.email);
    const user = await this.commandBus.execute<CreateUserCommand, User>(
      command,
    );

    return this.mapUserToResponse(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const user = await this.queryBus.execute<GetUserQuery, User>(query);
    return this.mapUserToResponse(user);
  }

  @Get()
  async listUsers() {
    const query = new ListUsersQuery();
    const users = await this.queryBus.execute<ListUsersQuery, User[]>(query);
    return users.map(this.mapUserToResponse);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserCommand) {
    const command = new UpdateUserCommand(id, body.name, body.email);
    const user = await this.commandBus.execute<UpdateUserCommand, User>(
      command,
    );
    return this.mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const command = new DeleteUserCommand(id);
    await this.commandBus.execute<DeleteUserCommand, void>(command);
    return { message: 'User deleted successfully' };
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      accountAge: user.getAccountAge(),
    };
  }
}
