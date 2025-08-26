import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateSnapshotsEvent } from 'src/snapshots/generate-snapshots.event';

@Injectable()
export class AccountsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  private readonly accounts: any[] = [];

  create(account: any) {
    const newAccount = {
      id: this.accounts.length + 1,
      ...account,
      createdAt: new Date().toISOString(),
    };

    this.accounts.push(newAccount);

    console.log(
      `🏦 AccountsService: Created account for ${newAccount.name} with balance ${newAccount.balance}`,
    );

    this.eventEmitter.emit(
      'snapshots.generate',
      new GenerateSnapshotsEvent('123'),
    );

    return newAccount;
  }

  getAccounts() {
    return this.accounts;
  }
}
