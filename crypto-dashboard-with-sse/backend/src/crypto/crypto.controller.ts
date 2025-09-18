import { Controller, Sse, Logger } from '@nestjs/common';
import { concatMap, timer, tap, catchError, of, map } from 'rxjs';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  private readonly logger = new Logger(CryptoController.name);

  constructor(private readonly cryptoService: CryptoService) {}

  @Sse('assets')
  getAssets() {
    this.logger.log('SSE 연결 시작');

    return timer(0, 10000).pipe(
      // 30초 → 60초로 변경
      tap((tick) => this.logger.log(`SSE 타이머 틱: ${tick}`)),
      concatMap(() => this.cryptoService.getAssets()),
      map((data) => {
        // ✅ SSE MessageEvent 형식으로 변환
        const messageEvent = {
          data: JSON.stringify(data), // JSON 문자열로 직렬화
          id: Date.now().toString(), // 고유 ID
          type: 'message', // 메시지 타입
        };
        this.logger.log(`데이터 전송: ${data.length}개 코인`);
        return messageEvent;
      }),
      catchError((error) => {
        this.logger.error('SSE 스트림 에러:', error);
        // 에러 시에도 올바른 형식으로 반환
        return of({
          data: JSON.stringify([]),
          id: Date.now().toString(),
          type: 'error',
        });
      }),
    );
  }
}
