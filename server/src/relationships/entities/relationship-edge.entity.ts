import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RelationshipEdge {
  @Field(() => ID)
  id: string;

  constructor(data: RelationshipEdge) {
    Object.assign(this, {
      id: data.id,
    });
  }
}
