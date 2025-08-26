import { Module } from '@nestjs/common';
import { SnapshotsController } from './snapshots.controller';
import { SnapshotsService } from './snapshots.service';
import { AccountsModule } from '../accounts/accounts.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [AccountsModule, EventsModule],
  controllers: [SnapshotsController],
  providers: [SnapshotsService],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
