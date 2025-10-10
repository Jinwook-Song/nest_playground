import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsRouter } from './posts.router';

@Module({
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
