import { Injectable, Inject } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerateSnapshotsEvent } from './generate-snapshots.event';
import { Redis } from 'ioredis';

@Injectable()
export class SnapshotsService {
  constructor(
    private readonly accountsService: AccountsService,
    @Inject('REDIS_PUB_CLIENT') private readonly redis: Redis,
  ) {}

  private readonly snapshots: any[] = [];

  @OnEvent('snapshots.generate')
  async generateSnapshots(event: GenerateSnapshotsEvent) {
    console.log(
      `🔄 SnapshotsService: Starting snapshot generation for user ${event.userId}`,
    );

    // 1. 기존 비즈니스 로직 - 스냅샷 생성
    const accounts = this.accountsService.getAccounts();
    for (const account of accounts) {
      this.snapshots.push({
        account,
        date: new Date(),
        userId: event.userId,
      });
    }

    console.log(
      `📊 SnapshotsService: Created ${accounts.length} snapshots for user ${event.userId}`,
    );

    // 2. Redis Pub/Sub로 이벤트 발행
    try {
      await this.redis.publish(
        'user-events',
        JSON.stringify({
          userId: event.userId,
          eventType: 'snapshots.generated',
          data: {
            snapshotCount: accounts.length,
            timestamp: new Date().toISOString(),
            serverId: process.env.SERVER_ID || 'unknown',
          },
        }),
      );

      console.log(
        `📤 SnapshotsService: Published event to Redis: snapshots.generated for user ${event.userId}`,
      );
    } catch (error) {
      console.error(
        `❌ SnapshotsService: Failed to publish event to Redis:`,
        error,
      );
    }
  }

  getSnapshots() {
    return this.snapshots;
  }
}
