import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString({
    message: 'what: The description must be a string',
  })
  @IsNotEmpty({
    message: 'what: The description cannot be empty',
  })
  what: string;

  @Field()
  @IsString({
    message: 'why: The description must be a string',
  })
  @IsNotEmpty({
    message: 'why: The description cannot be empty',
  })
  why: string;
}
