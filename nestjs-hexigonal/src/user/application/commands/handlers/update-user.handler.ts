import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/user/domain/entities/user.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../ports/user.repository.port';
import { UpdateUserCommand } from '../update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new NotFoundException('User not found');

    if (command.name) user.updateName(command.name);
    if (command.email) user.updateEmail(command.email);

    return this.userRepository.save(user);
  }
}
