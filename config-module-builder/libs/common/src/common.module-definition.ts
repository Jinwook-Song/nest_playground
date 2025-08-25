import { ConfigurableModuleBuilder } from '@nestjs/common';
import { CommonModuleOptions } from './common-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CommonModuleOptions>().build();
