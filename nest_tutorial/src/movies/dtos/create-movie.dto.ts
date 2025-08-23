import { Movie } from '../entities/movie.entity';

// Movie 엔티티에서 id를 제외한 모든 속성을 가진 DTO
export class CreateMovieDto implements Omit<Movie, 'id'> {
  readonly title: string;
  readonly year: number;
  readonly genres: string[];
}
