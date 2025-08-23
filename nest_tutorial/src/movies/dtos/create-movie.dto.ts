import { Movie } from '../entities/movie.entity';
import { IsString } from 'class-validator';
import { IsNumber } from 'class-validator';

// Movie 엔티티에서 id를 제외한 모든 속성을 가진 DTO
export class CreateMovieDto implements Omit<Movie, 'id'> {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsString({ each: true })
  readonly genres: string[];
}
