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

@Controller('movies')
export class MoviesController {
  @Get()
  getAll() {
    return '모든 영화 목록';
  }

  @Get('search')
  search(@Query('year') searchingYear: string) {
    return `${searchingYear}년도에 해당하는 영화 검색 결과`;
  }

  @Get(':id')
  getOne(@Param('id') movieId: string) {
    return `ID: ${movieId}인 영화 정보`;
  }

  @Post()
  create(@Body() movieData) {
    return {
      message: '영화가 생성되었습니다',
      data: movieData,
    };
  }

  @Delete(':id')
  remove(@Param('id') movieId: string) {
    return `ID: ${movieId}인 영화가 삭제되었습니다`;
  }

  @Patch(':id')
  patch(@Param('id') movieId: string, @Body() updateData) {
    return {
      message: `ID: ${movieId}인 영화가 수정되었습니다`,
      data: updateData,
    };
  }
}
