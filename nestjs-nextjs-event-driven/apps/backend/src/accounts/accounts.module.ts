import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { SnapshotsModule } from 'src/snapshots/snapshots.module';

@Module({
  imports: [forwardRef(() => SnapshotsModule)],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
