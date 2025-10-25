import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Todo] })],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
