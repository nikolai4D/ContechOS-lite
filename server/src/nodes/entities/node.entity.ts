import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Node {
  @Field(() => ID)
  id: string;

  @Field(() => [String])
  labels: string[];

  constructor(data: Node) {
    Object.assign(this, {
      id: data.id,
      labels: data.labels,
    });
  }
}
