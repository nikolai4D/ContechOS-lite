import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { RelationshipEdge } from './relationship-edge.entity';

@ObjectType()
export class Relationship {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLJSONObject)
  properties: { [key: string]: any };

  @Field()
  source: RelationshipEdge;

  @Field()
  target: RelationshipEdge;

  constructor(data: Relationship) {
    Object.assign(this, {
      id: data.id,
      name: data.name,
      properties: data.properties,
      source: new RelationshipEdge(data.source),
      target: new RelationshipEdge(data.target),
    });
  }
}
