import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsStrongPassword,
  IsString,
  IsNotEmpty,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
