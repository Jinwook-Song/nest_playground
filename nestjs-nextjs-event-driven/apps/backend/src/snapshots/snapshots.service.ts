import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerateSnapshotsEvent } from './generate-snapshots.event';

@Injectable()
export class SnapshotsService {
  constructor(private readonly accountsService: AccountsService) {}

  private readonly snapshots: any[] = [];

  @OnEvent('snapshots.generate')
  generateSnapshots(event: GenerateSnapshotsEvent) {
    const accounts = this.accountsService.getAccounts();
    for (const account of accounts) {
      this.snapshots.push({
        account,
        date: new Date(),
        userId: event.userId,
      });
    }
  }

  getSnapshots() {
    return this.snapshots;
  }
}
