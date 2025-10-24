import { Args, Query, Resolver } from '@nestjs/graphql';
import { Shop } from './entities/shop.entity';
import { ShopsService } from './shops.service';

@Resolver(() => Shop)
export class ShopsResolver {
  constructor(private readonly shopsService: ShopsService) {}

  @Query(() => [Shop])
  shops(): Promise<Shop[]> {
    return this.shopsService.findAll();
  }

  @Query(() => Shop)
  shop(@Args('id') id: number): Promise<Shop> {
    return this.shopsService.findOne(id);
  }
}
