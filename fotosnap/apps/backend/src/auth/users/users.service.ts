import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from 'src/database/database.module';
import { and, eq, ne, not, notInArray, sql } from 'drizzle-orm';
import { follow, user } from '../schema';
import { post } from 'src/posts/schemas/schema';
import { UpdateProfileInput, UserProfile } from '@repo/trpc/schemas';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string) {
    const foundUser = await this.db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.db.query.follow.findFirst({
      where: and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, followingId),
      ),
    });

    if (existingFollow) {
      throw new BadRequestException('You are already following this user');
    }

    await this.db.insert(follow).values({ followerId, followingId });
  }

  async unfollow(followerId: string, followingId: string) {
    const existingFollow = await this.db.query.follow.findFirst({
      where: and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, followingId),
      ),
    });

    if (!existingFollow) {
      throw new BadRequestException('You are not following this user');
    }

    await this.db
      .delete(follow)
      .where(
        and(
          eq(follow.followerId, followerId),
          eq(follow.followingId, followingId),
        ),
      );
  }

  async getFollowers(userId: string) {
    return this.db.query.follow.findMany({
      where: eq(follow.followingId, userId),
      with: {
        follower: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getFollowing(userId: string) {
    return this.db.query.follow.findMany({
      where: eq(follow.followerId, userId),
      with: {
        following: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getSuggestedUsers(userId: string) {
    const followingIds = await this.db.query.follow.findMany({
      where: eq(follow.followerId, userId),
    });

    const followingIdsList = followingIds.map((follow) => follow.followingId);

    return this.db.query.user.findMany({
      where: and(
        ne(schema.user.id, userId),
        followingIdsList.length > 0
          ? notInArray(user.id, followingIdsList)
          : undefined,
      ),
      columns: {
        id: true,
        name: true,
      },
      limit: 5,
    });
  }

  async getUserProfile(
    userId: string,
    currentUserId: string,
  ): Promise<UserProfile> {
    const result = await this.db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio,
        website: user.website,
        followerCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM $(follow) f
        WHERE f.${follow.followingId} = ${user}.${user.id}
      )`,
        followingCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM $(follow) f
        WHERE f.${follow.followerId} = ${user}.${user.id}
      )`,
        postCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM $(post) p
        WHERE p.${post.userId} = ${user}.${user.id}
      )`,
        isFollowing: sql<boolean>`EXISTS(
        SELECT 1
        FROM $(follow) f
        WHERE f.${follow.followerId} = ${currentUserId}
          AND f.${follow.followingId} = ${user}.${user.id}
      )`,
      })
      .from(user)
      .where(eq(user.id, userId));

    return result[0] || null;
  }

  async updateProfile(userId: string, updates: UpdateProfileInput) {
    await this.db.update(user).set(updates).where(eq(user.id, userId));
  }
}
