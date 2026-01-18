import {
  Ctx,
  Input,
  Query,
  Mutation,
  UseMiddlewares,
} from '@mguay/nestjs-trpc';
import { AuthTRPCMiddleware } from 'src/auth/auth-trpc.middleware';
import { Router } from '@mguay/nestjs-trpc';
import { AppContext } from 'src/app.context.interface';
import {
  CreateStoryInput,
  createStorySchema,
  storyGroupSchema,
} from '@repo/trpc/schemas';
import { StoriesService } from './stories.service';
import z from 'zod';

@Router()
@UseMiddlewares(AuthTRPCMiddleware)
export class StoriesRouter {
  constructor(private readonly storiesService: StoriesService) {}

  @Mutation({ input: createStorySchema })
  async createStory(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.storiesService.createStory(createStoryInput, ctx.user.id);
  }

  @Query({ output: z.array(storyGroupSchema) })
  async getStories(@Ctx() ctx: AppContext) {
    return this.storiesService.getStories(ctx.user.id);
  }
}
