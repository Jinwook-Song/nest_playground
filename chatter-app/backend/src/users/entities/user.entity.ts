import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@Schema({ versionKey: false })
@ObjectType()
export class User extends AbstractEntity {
  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
