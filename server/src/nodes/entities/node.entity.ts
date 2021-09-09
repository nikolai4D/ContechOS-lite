import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Node {
  @Field(() => ID)
  id: string;

  @Field(() => [String])
  labels: string[];

  @Field(() => GraphQLJSONObject)
  properties: { [key: string]: any };

  constructor(data: Node) {
    Object.assign(this, {
      id: data.id,
      labels: data.labels,
      properties: data.properties,
    });
  }
}
