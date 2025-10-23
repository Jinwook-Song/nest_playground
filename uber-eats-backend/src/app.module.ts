import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ShopsModule } from './shops/shops.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    ShopsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
