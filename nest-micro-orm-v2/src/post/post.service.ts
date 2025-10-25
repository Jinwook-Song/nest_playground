import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: EntityRepository<Post>,
    private readonly em: EntityManager,
  ) {}

  async create(userId: number, title: string, content?: string): Promise<Post> {
    const user = await this.em.findOne(User, userId);
    if (!user) throw new NotFoundException('User not found');
    const post = this.postRepo.create({ author: user, title, content });
    await this.postRepo.persistAndFlush(post);
    return post;
  }

  async findAll(): Promise<Post[]> {
    return this.postRepo.findAll();
  }
}
