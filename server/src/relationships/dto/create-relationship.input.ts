import { InputType, Field } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { RelationshipEdgeDto } from './relationship-edge.dto';

@InputType()
export class CreateRelationshipInput {
  @Field()
  name: string;

  @Field(() => GraphQLJSONObject)
  properties: { [key: string]: any };

  @Field(() => RelationshipEdgeDto)
  @ValidateNested()
  source: RelationshipEdgeDto;

  @Field(() => RelationshipEdgeDto)
  @ValidateNested()
  target: RelationshipEdgeDto;
}
