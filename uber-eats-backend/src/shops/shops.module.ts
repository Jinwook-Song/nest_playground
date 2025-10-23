import { Module } from '@nestjs/common';
import { ShopsResolver } from './shops.resolver';

@Module({
  providers: [ShopsResolver],
})
export class ShopsModule {}
