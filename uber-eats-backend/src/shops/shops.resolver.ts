import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ShopsResolver {
  @Query(() => Boolean)
  shops(): boolean {
    return true;
  }
}
