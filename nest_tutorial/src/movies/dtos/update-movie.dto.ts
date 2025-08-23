import { Movie } from '../entities/movie.entity';

// Movie 엔티티에서 id를 제외하고 모든 속성을 선택적으로 가진 DTO
export class UpdateMovieDto implements Partial<Omit<Movie, 'id'>> {
  readonly title?: string;
  readonly year?: number;
  readonly genres?: string[];
}
