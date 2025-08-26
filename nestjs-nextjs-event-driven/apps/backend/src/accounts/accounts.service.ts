import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateSnapshotsEvent } from 'src/snapshots/generate-snapshots.event';

@Injectable()
export class AccountsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  private readonly accounts: any[] = [];

  create(account: any) {
    this.accounts.push(account);
    this.eventEmitter.emit(
      'snapshots.generate',
      new GenerateSnapshotsEvent('123'),
    );
  }

  getAccounts() {
    return this.accounts;
  }
}
