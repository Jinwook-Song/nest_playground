import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: EntityRepository<Profile>,
    private readonly em: EntityManager,
  ) {}

  async create(
    userId: number,
    data: Partial<Pick<Profile, 'fullName' | 'bio' | 'avatarUrl'>>,
  ): Promise<Profile> {
    const user = await this.em.findOne(User, userId);
    if (!user) throw new NotFoundException('User not found');
    const profile = this.profileRepo.create({ user, ...data });
    await this.profileRepo.persistAndFlush(profile);
    return profile;
  }

  async findByUser(userId: number): Promise<Profile | null> {
    return this.profileRepo.findOne({ user: userId } as any);
  }
}
