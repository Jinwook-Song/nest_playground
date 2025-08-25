import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SnapshotsService } from '../snapshots/snapshots.service';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(forwardRef(() => SnapshotsService))
    private readonly snapshotsService: SnapshotsService,
  ) {}

  private readonly accounts: any[] = [];

  create(account: any) {
    this.accounts.push(account);
    this.snapshotsService.generateSnapshots();
  }

  getAccounts() {
    return this.accounts;
  }
}
