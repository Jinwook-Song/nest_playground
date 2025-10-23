import { Query, Resolver } from '@nestjs/graphql';
import { Shop } from './entities/shop.entity';

@Resolver()
export class ShopsResolver {
  @Query(() => [Shop])
  shops(): Shop[] {
    return [
      {
        name: 'Shop 1',
        isGood: true,
      },
    ];
  }
}
