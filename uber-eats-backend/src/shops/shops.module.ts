import { Module } from '@nestjs/common';
import { ShopsResolver } from './shops.resolver';
import { Shop } from './entities/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopsService } from './shops.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop])],
  providers: [ShopsResolver, ShopsService],
})
export class ShopsModule {}
