import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateRelationshipInput {
  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  properties?: { [key: string]: any };
}
