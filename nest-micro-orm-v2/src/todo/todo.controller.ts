import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { User } from '../user/user.entity';

class CreateTodoDto {
  userId!: number;
  title!: string;
  description?: string;
}

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly em: EntityManager,
  ) {}

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    const user = await this.em.findOne(User, dto.userId);
    if (!user) throw new NotFoundException('User not found');
    return this.todoService.create(user, dto.title, dto.description);
  }

  @Get()
  async findAll() {
    return this.todoService.findAll();
  }
}
