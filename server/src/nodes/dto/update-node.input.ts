import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateNodeInput {
  @Field(() => [String], { nullable: true })
  @ArrayMinSize(1)
  @IsOptional()
  labels?: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  properties?: { [key: string]: any };
}
