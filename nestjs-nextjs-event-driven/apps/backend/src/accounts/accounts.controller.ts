import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountRequest } from './dto/create-account.requeset';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  createAccount(@Body() createAccountRequest: CreateAccountRequest) {
    return this.accountsService.create(createAccountRequest);
  }
}
