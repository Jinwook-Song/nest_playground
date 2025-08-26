import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot(), AccountsModule, SnapshotsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
