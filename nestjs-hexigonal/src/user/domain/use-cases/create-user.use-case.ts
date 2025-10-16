import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from 'src/user/application/ports/user.repository.port';

export interface CreateUserDto {
  name: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already in use');

    const user = User.create(dto.name, dto.email);

    return this.userRepository.save(user);
  }
}
