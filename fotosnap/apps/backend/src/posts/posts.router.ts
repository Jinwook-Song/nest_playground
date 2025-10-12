import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  TRPCContext,
  UseMiddlewares,
} from 'nestjs-trpc';
import {
  CreatePostInput,
  createPostSchema,
  postSchema,
} from './schemas/trpc.schema';
import { PostsService } from './posts.service';
import { z } from 'zod';
import { AuthTRPCMiddleware } from 'src/auth/auth-trpc.middleware';
import { AppContext } from 'src/app.context.interface';

@Router()
@UseMiddlewares(AuthTRPCMiddleware)
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema, output: postSchema })
  async create(
    @Input() createPostInput: CreatePostInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.postsService.create(createPostInput, ctx.user.id);
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
