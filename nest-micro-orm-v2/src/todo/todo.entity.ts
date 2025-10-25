import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../user/user.entity';

@Entity({ tableName: 'todos' })
export class Todo {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: false })
  completed = false;

  @ManyToOne(() => User, { onDelete: 'cascade', nullable: false })
  user!: User;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
