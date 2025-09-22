import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

@Schema({ versionKey: false })
export class UserDocument extends AbstractEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  username: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
