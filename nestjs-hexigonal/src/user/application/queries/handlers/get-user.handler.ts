import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../ports/user.repository.port';
import { UserRepositoryPort } from '../../ports/user.repository.port';
import { User } from 'src/user/domain/entities/user.entity';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
