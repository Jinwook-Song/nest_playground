import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCategoryRequest } from './dto/create-category.request';
import { CategoriesService } from './categories.service';
import { AddToPostRequest } from './dto/add-to-post.request';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    return this.categoriesService.getCategories();
  }

  @Post()
  async createCategory(@Body() request: CreateCategoryRequest) {
    return this.categoriesService.createCategory(request);
  }

  @Post('post')
  async addToPost(@Body() request: AddToPostRequest) {
    return this.categoriesService.addToPost(request);
  }
}
