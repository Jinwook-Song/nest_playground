import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
