import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { finalize, interval, map, merge, Observable, Subject } from 'rxjs';
import { Redis } from 'ioredis';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private userStreams = new Map<string, Subject<any>>();

  constructor(@Inject('REDIS_SUB_CLIENT') private readonly subscriber: Redis) {}

  async onModuleInit() {
    // Redis 채널 구독 시작
    await this.subscriber.subscribe('user-events');

    this.subscriber.on('message', (channel, message) => {
      if (channel === 'user-events') {
        this.handleRedisMessage(message);
      }
    });

    console.log('📥 EventsService: Subscribed to Redis channel: user-events');
  }

  async onModuleDestroy() {
    await this.subscriber.unsubscribe('user-events');
    this.subscriber.disconnect();
    console.log('🔌 EventsService: Disconnected from Redis');
  }

  private handleRedisMessage(message: string) {
    try {
      const { userId, eventType, data } = JSON.parse(message);
      console.log(
        `📨 EventsService: Received from Redis: ${eventType} for user ${userId}`,
      );

      // 해당 사용자의 SSE 스트림으로 전달
      this.deliverEventToUser(userId, eventType, data);
    } catch (error) {
      console.error('❌ EventsService: Error parsing Redis message:', error);
    }
  }

  private deliverEventToUser(userId: string, eventType: string, data: any) {
    const userStream = this.userStreams.get(userId);
    if (userStream) {
      userStream.next({
        data: { eventType, ...data },
      });
      console.log(
        `✅ EventsService: Delivered event to user ${userId}: ${eventType}`,
      );
    } else {
      console.log(`⚠️ EventsService: No active stream for user ${userId}`);
    }
  }

  private getOrCreateStream(userId: string): Subject<any> {
    if (!this.userStreams.has(userId)) {
      this.userStreams.set(userId, new Subject<any>());
      console.log(`🔗 EventsService: Created new stream for user ${userId}`);
    }
    return this.userStreams.get(userId)!;
  }

  getEvent$(userId: string): Observable<MessageEvent> {
    const userStream = this.getOrCreateStream(userId);

    const keepAlive$ = interval(15000).pipe(
      map(() => ({
        type: 'ping',
        serverId: process.env.SERVER_ID || 'unknown',
        timestamp: Date.now(),
      })),
    );

    return merge(userStream.asObservable(), keepAlive$).pipe(
      finalize(() => {
        console.log(
          `🚩 EventsService: User ${userId} disconnected from server ${process.env.SERVER_ID || 'unknown'}`,
        );
        this.userStreams.delete(userId);
      }),
    );
  }
}
