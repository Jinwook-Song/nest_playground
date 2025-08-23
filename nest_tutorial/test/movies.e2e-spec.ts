import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // main.ts와 동일한 설정 적용
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/movies (GET)', () => {
    it('빈 영화 목록을 반환해야 함', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('영화 목록을 반환해야 함', async () => {
      // 먼저 영화를 생성
      const newMovie = {
        title: 'Test Movie',
        year: 2023,
        genres: ['Action', 'Drama'],
      };

      await request(app.getHttpServer()).post('/movies').send(newMovie).expect(201);

      // 생성된 영화가 목록에 포함되는지 확인
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]).toMatchObject(newMovie);
          expect(res.body[0]).toHaveProperty('id');
        });
    });
  });

  describe('/movies (POST)', () => {
    it('새로운 영화를 생성해야 함', () => {
      const newMovie = {
        title: 'Inception',
        year: 2010,
        genres: ['Action', 'Sci-Fi', 'Thriller'],
      };

      return request(app.getHttpServer())
        .post('/movies')
        .send(newMovie)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject(newMovie);
          expect(res.body).toHaveProperty('id');
          expect(typeof res.body.id).toBe('number');
        });
    });

    it('잘못된 데이터로 생성 시 400 에러를 반환해야 함', () => {
      const invalidMovie = {
        title: 123, // string이어야 함
        year: 'invalid', // number여야 함
        genres: 'not-array', // array여야 함
      };

      return request(app.getHttpServer()).post('/movies').send(invalidMovie).expect(400);
    });

    it('필수 필드 누락 시 400 에러를 반환해야 함', () => {
      const incompleteMovie = {
        title: 'Incomplete Movie',
        // year와 genres 누락
      };

      return request(app.getHttpServer()).post('/movies').send(incompleteMovie).expect(400);
    });

    it('허용되지 않은 필드 포함 시 400 에러를 반환해야 함', () => {
      const movieWithExtraFields = {
        title: 'Test Movie',
        year: 2023,
        genres: ['Action'],
        extraField: 'not allowed', // 허용되지 않은 필드
      };

      return request(app.getHttpServer()).post('/movies').send(movieWithExtraFields).expect(400);
    });
  });

  describe('/movies/:id (GET)', () => {
    let createdMovieId: number;

    beforeEach(async () => {
      // 테스트용 영화 생성
      const newMovie = {
        title: 'Test Movie for GET',
        year: 2023,
        genres: ['Action'],
      };

      const response = await request(app.getHttpServer()).post('/movies').send(newMovie).expect(201);

      createdMovieId = response.body.id;
    });

    it('특정 영화를 반환해야 함', () => {
      return request(app.getHttpServer())
        .get(`/movies/${createdMovieId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdMovieId);
          expect(res.body).toHaveProperty('title', 'Test Movie for GET');
          expect(res.body).toHaveProperty('year', 2023);
          expect(res.body).toHaveProperty('genres', ['Action']);
        });
    });

    it('존재하지 않는 영화 ID로 조회 시 404 에러를 반환해야 함', () => {
      return request(app.getHttpServer())
        .get('/movies/999999')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Movie with ID 999999 not found');
        });
    });

    it('잘못된 ID 형식으로 조회 시 404 에러를 반환해야 함', () => {
      return request(app.getHttpServer()).get('/movies/invalid-id').expect(404);
    });
  });

  describe('/movies/search (GET)', () => {
    beforeEach(async () => {
      // 테스트용 영화들 생성
      const movies = [
        { title: 'Movie 2020 A', year: 2020, genres: ['Action'] },
        { title: 'Movie 2020 B', year: 2020, genres: ['Drama'] },
        { title: 'Movie 2021', year: 2021, genres: ['Comedy'] },
      ];

      for (const movie of movies) {
        await request(app.getHttpServer()).post('/movies').send(movie).expect(201);
      }
    });

    it('특정 연도의 영화들을 검색해야 함', () => {
      return request(app.getHttpServer())
        .get('/movies/search?year=2020')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body.every((movie: any) => movie.year === 2020)).toBe(true);
        });
    });

    it('해당 연도의 영화가 없을 경우 빈 배열을 반환해야 함', () => {
      return request(app.getHttpServer()).get('/movies/search?year=2019').expect(200).expect([]);
    });

    it('year 파라미터 없이 요청 시 빈 배열을 반환해야 함', () => {
      return request(app.getHttpServer()).get('/movies/search').expect(200).expect([]);
    });
  });

  describe('/movies/:id (PATCH)', () => {
    let createdMovieId: number;

    beforeEach(async () => {
      // 테스트용 영화 생성
      const newMovie = {
        title: 'Original Movie',
        year: 2023,
        genres: ['Action'],
      };

      const response = await request(app.getHttpServer()).post('/movies').send(newMovie).expect(201);

      createdMovieId = response.body.id;
    });

    it('영화 정보를 부분 업데이트해야 함', () => {
      const updateData = {
        title: 'Updated Movie',
        year: 2024,
      };

      return request(app.getHttpServer())
        .patch(`/movies/${createdMovieId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: createdMovieId,
            title: 'Updated Movie',
            year: 2024,
            genres: ['Action'], // 기존 값 유지
          });
        });
    });

    it('일부 필드만 업데이트해야 함', () => {
      const updateData = {
        title: 'Updated Title Only',
      };

      return request(app.getHttpServer())
        .patch(`/movies/${createdMovieId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: createdMovieId,
            title: 'Updated Title Only',
            year: 2023, // 기존 값 유지
            genres: ['Action'], // 기존 값 유지
          });
        });
    });

    it('빈 업데이트 데이터로도 작동해야 함', () => {
      return request(app.getHttpServer())
        .patch(`/movies/${createdMovieId}`)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: createdMovieId,
            title: 'Original Movie',
            year: 2023,
            genres: ['Action'],
          });
        });
    });

    it('존재하지 않는 영화 ID로 업데이트 시 404 에러를 반환해야 함', () => {
      const updateData = {
        title: 'Updated Movie',
      };

      return request(app.getHttpServer())
        .patch('/movies/999999')
        .send(updateData)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Movie with ID 999999 not found');
        });
    });

    it('잘못된 데이터로 업데이트 시 400 에러를 반환해야 함', () => {
      const invalidUpdateData = {
        title: 123, // string이어야 함
        year: 'invalid', // number여야 함
      };

      return request(app.getHttpServer()).patch(`/movies/${createdMovieId}`).send(invalidUpdateData).expect(400);
    });
  });

  describe('/movies/:id (DELETE)', () => {
    let createdMovieId: number;

    beforeEach(async () => {
      // 테스트용 영화 생성
      const newMovie = {
        title: 'Movie to Delete',
        year: 2023,
        genres: ['Action'],
      };

      const response = await request(app.getHttpServer()).post('/movies').send(newMovie).expect(201);

      createdMovieId = response.body.id;
    });

    it('영화를 삭제해야 함', async () => {
      // 삭제 요청
      await request(app.getHttpServer()).delete(`/movies/${createdMovieId}`).expect(200).expect('true');

      // 삭제된 영화가 조회되지 않는지 확인
      await request(app.getHttpServer()).get(`/movies/${createdMovieId}`).expect(404);
    });

    it('존재하지 않는 영화 ID로 삭제 시 404 에러를 반환해야 함', () => {
      return request(app.getHttpServer())
        .delete('/movies/999999')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Movie with ID 999999 not found');
        });
    });

    it('잘못된 ID 형식으로 삭제 시 404 에러를 반환해야 함', () => {
      return request(app.getHttpServer()).delete('/movies/invalid-id').expect(404);
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('전체 CRUD 플로우가 올바르게 작동해야 함', async () => {
      // 1. 초기 상태 - 빈 목록
      await request(app.getHttpServer()).get('/movies').expect(200).expect([]);

      // 2. 영화 생성
      const newMovie = {
        title: 'Integration Test Movie',
        year: 2023,
        genres: ['Action', 'Sci-Fi'],
      };

      const createResponse = await request(app.getHttpServer()).post('/movies').send(newMovie).expect(201);

      const createdMovieId = createResponse.body.id;
      expect(createdMovieId).toBeDefined();

      // 3. 생성된 영화 조회
      await request(app.getHttpServer())
        .get(`/movies/${createdMovieId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(newMovie);
        });

      // 4. 영화 목록에 포함되는지 확인
      await request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]).toMatchObject(newMovie);
        });

      // 5. 영화 정보 수정
      const updateData = {
        title: 'Updated Integration Test Movie',
        year: 2024,
      };

      await request(app.getHttpServer())
        .patch(`/movies/${createdMovieId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            ...newMovie,
            ...updateData,
          });
        });

      // 6. 연도로 검색
      await request(app.getHttpServer())
        .get('/movies/search?year=2024')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].year).toBe(2024);
        });

      // 7. 영화 삭제
      await request(app.getHttpServer()).delete(`/movies/${createdMovieId}`).expect(200).expect('true');

      // 8. 삭제 후 빈 목록 확인
      await request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });
  });
});
