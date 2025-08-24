import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePostRequest } from './dto/create-post.request';
import { PostsService } from './posts.service';
import { UpdatePostRequest } from './dto/update-post.request';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsService.getPost(Number(id));
  }

  @Post()
  async createPost(@Body() request: CreatePostRequest) {
    return this.postsService.createPost(request, request.category);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() request: UpdatePostRequest,
  ) {
    return this.postsService.updatePost(Number(id), request);
  }
}
