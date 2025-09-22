import { AbstractEntity } from 'src/common/database/abstract.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User extends AbstractEntity {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  imageUrl: string;
}
