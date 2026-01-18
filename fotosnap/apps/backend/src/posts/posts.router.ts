import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from '@mguay/nestjs-trpc';
import {
  CreatePostInput,
  createPostSchema,
  FindAllPostsInput,
  findAllPostsSchema,
  LikePostInput,
  likePostSchema,
  postSchema,
} from '@repo/trpc/schemas';
import { PostsService } from './posts.service';
import { z } from 'zod';
import { AuthTRPCMiddleware } from 'src/auth/auth-trpc.middleware';
import { AppContext } from 'src/app.context.interface';

@Router()
@UseMiddlewares(AuthTRPCMiddleware)
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema })
  async create(
    @Input() createPostInput: CreatePostInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.postsService.create(createPostInput, ctx.user.id);
  }

  @Query({ input: findAllPostsSchema, output: z.array(postSchema) })
  async findAll(
    @Ctx() ctx: AppContext,
    @Input() findAllPostsInput: FindAllPostsInput,
  ) {
    return this.postsService.findAll(ctx.user.id, findAllPostsInput.userId);
  }

  @Mutation({ input: likePostSchema })
  async likePost(
    @Input() likePostInput: LikePostInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.postsService.likePost(likePostInput.postId, ctx.user.id);
  }
}
