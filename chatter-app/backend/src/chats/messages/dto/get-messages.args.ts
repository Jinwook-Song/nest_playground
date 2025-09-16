import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetMessagesArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
