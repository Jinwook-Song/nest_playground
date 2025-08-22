import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get('search')
  search(@Query('year') searchingYear: string): Movie[] {
    return this.moviesService.search(searchingYear);
  }

  @Get(':id')
  getOne(@Param('id') movieId: string): Movie {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: Omit<Movie, 'id'>): Movie {
    return this.moviesService.create(movieData);
  }

  @Delete(':id')
  remove(@Param('id') movieId: string): boolean {
    return this.moviesService.remove(movieId);
  }

  @Patch(':id')
  patch(
    @Param('id') movieId: string,
    @Body() updateData: Partial<Omit<Movie, 'id'>>,
  ): Movie {
    return this.moviesService.patch(movieId, updateData);
  }
}
