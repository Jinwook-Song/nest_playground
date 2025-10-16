import { UserRepositoryPort } from 'src/user/application/ports/user.repository.port';
import { User } from 'src/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private users: Map<string, User> = new Map();

  async save(user: User) {
    this.users.set(user.getId().getValue(), user);
    return user;
  }
  findById(id: string) {
    return this.users.get(id) ?? null;
  }
  findByEmail(email: string) {
    const user = Array.from(this.users.values());
    return user.find((user) => user.getEmail().getValue() === email) ?? null;
  }
  findAll() {
    return Array.from(this.users.values());
  }
  delete(id: string) {
    this.users.delete(id);
  }
}
