import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../list-users.query';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../ports/user.repository.port';
import { UserRepositoryPort } from '../../ports/user.repository.port';
import { User } from 'src/user/domain/entities/user.entity';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(_: ListUsersQuery): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
