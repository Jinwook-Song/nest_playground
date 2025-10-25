import { Body, Controller, Get, Post as HttpPost } from '@nestjs/common';
import { PostService } from './post.service';

class CreatePostDto {
  userId!: number;
  title!: string;
  content?: string;
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto.userId, dto.title, dto.content);
  }

  @Get()
  async findAll() {
    return this.postService.findAll();
  }
}
