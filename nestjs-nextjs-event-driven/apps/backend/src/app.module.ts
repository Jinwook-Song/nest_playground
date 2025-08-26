import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule,
    AccountsModule,
    SnapshotsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
