import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

@ArgsType()
export class MessageCreatedArgs {
  @Field(() => [String])
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  chatIds: string[];
}
