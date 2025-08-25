import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class SnapshotsService {
  constructor(
    @Inject(forwardRef(() => AccountsService))
    private readonly accountsService: AccountsService,
  ) {}

  private readonly snapshots: any[] = [];

  generateSnapshots() {
    const accounts = this.accountsService.getAccounts();
    for (const account of accounts) {
      this.snapshots.push({
        account,
        date: new Date(),
      });
    }
  }

  getSnapshots() {
    return this.snapshots;
  }
}
