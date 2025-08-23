import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

// CreateMovieDto의 모든 필드를 선택적으로 만든 DTO
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
