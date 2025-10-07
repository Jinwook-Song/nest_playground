import { Public } from '@mguay/nestjs-better-auth';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Public()
  health(): boolean {
    return true;
  }
}
