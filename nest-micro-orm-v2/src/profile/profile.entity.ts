import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../user/user.entity';

@Entity({ tableName: 'profiles' })
export class Profile {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => User, undefined, {
    owner: true,
    onDelete: 'cascade',
    unique: true,
    nullable: false,
  })
  user!: User;

  @Property({ nullable: true })
  fullName?: string;

  @Property({ nullable: true })
  bio?: string;

  @Property({ nullable: true })
  avatarUrl?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
