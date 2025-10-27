import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../users/user.entity';

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @ManyToOne(() => User, {
    nullable: false, // NOT NULL
    onDelete: 'cascade', // User 삭제시 Post도 삭제
  })
  author!: User;

  // 조회수 (default 0)
  @Property({ default: 0 })
  views = 0;

  @Property()
  createdAt: Date = new Date();
}
