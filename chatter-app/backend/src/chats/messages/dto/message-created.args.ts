import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class MessageCreatedArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
