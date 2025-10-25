import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: EntityRepository<Todo>,
  ) {}

  async create(user: User, title: string, description?: string): Promise<Todo> {
    const todo = this.todoRepo.create({ user, title, description });
    await this.todoRepo.persistAndFlush(todo);
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepo.findAll();
  }
}
