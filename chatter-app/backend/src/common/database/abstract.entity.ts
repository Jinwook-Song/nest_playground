import { Prop, Schema } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema()
@ObjectType({ isAbstract: true })
export class AbstractEntity {
  @Prop({ type: SchemaTypes.ObjectId })
  @Field(() => ID)
  _id: Types.ObjectId;
}
