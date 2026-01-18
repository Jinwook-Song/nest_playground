import { Inject, Injectable } from '@nestjs/common';
import { CreateStoryInput, StoryGroup } from '@repo/trpc/schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { story } from './schemas/schema';
import { and, eq, gte } from 'drizzle-orm';

@Injectable()
export class StoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createStory(createStoryInput: CreateStoryInput, userId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.db.insert(story).values({
      userId,
      image: createStoryInput.image,
      expiresAt,
    });
  }

  async getStories(userId: string): Promise<StoryGroup[]> {
    const stories = await this.db.query.story.findMany({
      where: gte(story.expiresAt, new Date()),
      with: { user: true },
    });

    const storyGroup = new Map<string, StoryGroup>();

    for (const story of stories) {
      if (!storyGroup.has(story.userId)) {
        storyGroup.set(story.userId, {
          userId: story.userId,
          username: story.user.name,
          avatar: story.user.image || '',
          stories: [],
        });
      }

      const group = storyGroup.get(story.userId);

      group?.stories.push({
        id: story.id,
        user: {
          id: story.user.id,
          username: story.user.name,
          avatar: story.user.image || '',
        },
        image: story.image,
        createdAt: story.createdAt.toISOString(),
        expiresAt: story.expiresAt.toISOString(),
      });
    }

    return Array.from(storyGroup.values());
  }
}
