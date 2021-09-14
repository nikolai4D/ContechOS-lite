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
  @IsUUID('4')
  source: string;

  @Field()
  @IsUUID('4')
  target: string;
}
