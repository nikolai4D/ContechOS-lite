import { InputType, Field } from '@nestjs/graphql';
import { IsObject, IsString, IsUUID } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateRelationshipInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsObject()
  properties: { [key: string]: any };

  @Field()
  @IsString()
  source: string;

  @Field()
  @IsString()
  target: string;
}
