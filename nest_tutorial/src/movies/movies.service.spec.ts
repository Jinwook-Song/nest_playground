import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { Movie } from './entities/movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    // 각 테스트 후 서비스 상태 초기화
    service['movies'] = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('빈 배열을 반환해야 함', () => {
      const result = service.getAll();
      expect(result).toEqual([]);
    });

    it('모든 영화 목록을 반환해야 함', () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        year: 2023,
        genres: ['Action'],
      };
      service['movies'].push(mockMovie);

      const result = service.getAll();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('getOne', () => {
    it('영화 ID로 특정 영화를 반환해야 함', () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        year: 2023,
        genres: ['Action'],
      };
      service['movies'].push(mockMovie);

      const result = service.getOne(1);
      expect(result).toEqual(mockMovie);
    });

    it('존재하지 않는 영화 ID로 조회 시 NotFoundException을 던져야 함', () => {
      expect(() => service.getOne(999)).toThrow(NotFoundException);
      expect(() => service.getOne(999)).toThrow('Movie with ID 999 not found');
    });
  });

  describe('search', () => {
    beforeEach(() => {
      const mockMovies: Movie[] = [
        { id: 1, title: 'Movie 2020', year: 2020, genres: ['Action'] },
        { id: 2, title: 'Movie 2021', year: 2021, genres: ['Drama'] },
        { id: 3, title: 'Another 2020', year: 2020, genres: ['Comedy'] },
      ];
      service['movies'] = mockMovies;
    });

    it('특정 연도의 영화들을 반환해야 함', () => {
      const result = service.search(2020);
      expect(result).toHaveLength(2);
      expect(result[0].year).toBe(2020);
      expect(result[1].year).toBe(2020);
    });

    it('해당 연도의 영화가 없을 경우 빈 배열을 반환해야 함', () => {
      const result = service.search(2019);
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('새로운 영화를 생성하고 반환해야 함', () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        year: 2023,
        genres: ['Action', 'Drama'],
      };

      const result = service.create(createMovieDto);

      expect(result).toEqual({
        id: expect.any(Number),
        title: 'New Movie',
        year: 2023,
        genres: ['Action', 'Drama'],
      });
      expect(service.getAll()).toHaveLength(1);
    });

    it('생성된 영화는 고유한 ID를 가져야 함', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Movie 1',
        year: 2023,
        genres: ['Action'],
      };

      const movie1 = service.create(createMovieDto);
      // ID 고유성을 보장하기 위해 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 1));
      const movie2 = service.create({ ...createMovieDto, title: 'Movie 2' });

      expect(movie1.id).not.toEqual(movie2.id);
    });
  });

  describe('remove', () => {
    it('영화를 삭제하고 true를 반환해야 함', () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        year: 2023,
        genres: ['Action'],
      };
      service['movies'].push(mockMovie);

      const result = service.remove(1);
      expect(result).toBe(true);
      expect(service.getAll()).toHaveLength(0);
    });

    it('존재하지 않는 영화 ID로 삭제 시 NotFoundException을 던져야 함', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow('Movie with ID 999 not found');
    });
  });

  describe('patch', () => {
    beforeEach(() => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Original Movie',
        year: 2023,
        genres: ['Action'],
      };
      service['movies'].push(mockMovie);
    });

    it('영화 정보를 부분 업데이트하고 반환해야 함', () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
        year: 2024,
      };

      const result = service.patch(1, updateMovieDto);

      expect(result).toEqual({
        id: 1,
        title: 'Updated Movie',
        year: 2024,
        genres: ['Action'], // 기존 값 유지
      });
    });

    it('일부 필드만 업데이트해야 함', () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Title Only',
      };

      const result = service.patch(1, updateMovieDto);

      expect(result).toEqual({
        id: 1,
        title: 'Updated Title Only',
        year: 2023, // 기존 값 유지
        genres: ['Action'], // 기존 값 유지
      });
    });

    it('존재하지 않는 영화 ID로 업데이트 시 NotFoundException을 던져야 함', () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
      };

      expect(() => service.patch(999, updateMovieDto)).toThrow(NotFoundException);
      expect(() => service.patch(999, updateMovieDto)).toThrow('Movie with ID 999 not found');
    });

    it('빈 업데이트 데이터로도 작동해야 함', () => {
      const updateMovieDto: UpdateMovieDto = {};

      const result = service.patch(1, updateMovieDto);

      expect(result).toEqual({
        id: 1,
        title: 'Original Movie',
        year: 2023,
        genres: ['Action'],
      });
    });
  });
});
