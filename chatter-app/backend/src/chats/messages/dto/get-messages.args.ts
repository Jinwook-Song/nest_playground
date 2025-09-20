import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

@ArgsType()
export class GetMessagesArgs extends PaginationArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
