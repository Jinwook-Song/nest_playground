import { Query, Resolver } from '@nestjs/graphql';
import { Shop } from './entities/shop.entity';

@Resolver(() => Shop)
export class ShopsResolver {
  @Query(() => [Shop])
  shops(): Shop[] {
    return [
      {
        id: 1,
        name: 'Shop 1',
        isGood: true,
      },
    ];
  }
}
