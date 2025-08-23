import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: string): Movie {
    const movie = this.movies.find((movie) => movie.id === Number(id));
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    return movie;
  }

  search(year: string): Movie[] {
    return this.movies.filter((movie) => movie.year === Number(year));
  }

  create(movieData: CreateMovieDto): Movie {
    const newMovie: Movie = {
      id: Date.now(),
      title: movieData.title,
      year: movieData.year,
      genres: movieData.genres,
    };
    this.movies.push(newMovie);
    return newMovie;
  }

  remove(id: string): boolean {
    const movieIndex = this.movies.findIndex((movie) => movie.id === Number(id));
    if (movieIndex === -1) throw new NotFoundException(`Movie with ID ${id} not found`);
    this.movies.splice(movieIndex, 1);
    return true;
  }

  patch(id: string, updateData: UpdateMovieDto): Movie {
    const movie = this.getOne(id);
    const updatedMovie = { ...movie, ...updateData };
    const movieIndex = this.movies.findIndex((movie) => movie.id === Number(id));
    this.movies[movieIndex] = updatedMovie;
    return updatedMovie;
  }
}
