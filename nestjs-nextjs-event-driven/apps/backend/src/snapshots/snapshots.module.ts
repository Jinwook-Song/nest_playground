import { forwardRef, Module } from '@nestjs/common';
import { SnapshotsController } from './snapshots.controller';
import { SnapshotsService } from './snapshots.service';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [forwardRef(() => AccountsModule)],
  controllers: [SnapshotsController],
  providers: [SnapshotsService],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
