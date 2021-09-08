import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize } from 'class-validator';

@InputType()
export class CreateNodeInput {
  @Field(() => [String])
  @ArrayMinSize(1)
  labels: string[];
}
