import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  async create(email: string, name?: string): Promise<User> {
    const user = this.userRepo.create({ email, name });
    await this.userRepo.persistAndFlush(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }
}
