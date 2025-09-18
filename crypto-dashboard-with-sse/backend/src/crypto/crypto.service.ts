import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, tap } from 'rxjs';
import { map, catchError, of } from 'rxjs';

@Injectable()
export class CryptoService {
  private lastSuccessfulData: any[] = [];
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5000; // 5초 캐시

  constructor(private readonly httpService: HttpService) {}

  getAssets(): Observable<any> {
    const now = Date.now();

    // 캐시된 데이터가 있고 아직 유효하다면 캐시 반환
    if (
      this.lastSuccessfulData.length > 0 &&
      now - this.lastFetchTime < this.CACHE_DURATION
    ) {
      console.log('📦 캐시된 데이터 사용 중...');
      return of(this.lastSuccessfulData);
    }

    console.log('🌐 CoinGecko API 새로 요청...');
    // CoinGecko의 모든 코인 정보를 가져옵니다.
    return this.httpService
      .get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 20,
          page: 1,
          sparkline: false,
        },
        timeout: 5000, // 10초 타임아웃
      })
      .pipe(
        tap((response) => {
          console.log('🌐 CoinGecko API 응답 상태:', response.status);
          console.log('🌐 Rate Limit 헤더:', {
            remaining: response.headers['x-ratelimit-remaining'],
            limit: response.headers['x-ratelimit-limit'],
            reset: response.headers['x-ratelimit-reset'],
          });
        }),
        map((response) => {
          // ✅ 성공 시 캐시 업데이트
          this.lastSuccessfulData = response.data;
          this.lastFetchTime = Date.now();
          console.log('✅ 새 데이터 캐시에 저장됨');
          return response.data;
        }),
        catchError((error) => {
          console.error('🚨 CoinGecko API Error:');
          console.error('- Status:', error.response?.status);
          console.error('- Message:', error.message);
          console.error('- Headers:', error.response?.headers);

          if (error.response?.status === 429) {
            console.error('⚠️ Rate Limit 초과! 캐시된 데이터 사용');
          }

          // 에러 시 캐시된 데이터가 있으면 반환, 없으면 빈 배열
          return of(
            this.lastSuccessfulData.length > 0 ? this.lastSuccessfulData : [],
          );
        }),
      );
  }
}
