import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { SnapshotsModule } from './snapshots/snapshots.module';

@Module({
  imports: [AccountsModule, SnapshotsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
