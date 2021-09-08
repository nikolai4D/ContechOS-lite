import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateNodeInput {
  @Field(() => [String])
  @ArrayMinSize(1)
  labels: string[];

  @Field(() => GraphQLJSONObject)
  properties: { [key: string]: any };
}
