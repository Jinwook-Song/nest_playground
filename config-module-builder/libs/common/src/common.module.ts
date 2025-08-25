import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigurableModuleClass } from './common.module-definition';

@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule extends ConfigurableModuleClass {}
