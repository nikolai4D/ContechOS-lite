import { InputType, Field } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { RelationshipEdge } from '../entities/relationship-edge.entity';

@InputType()
export class CreateRelationshipInput {
  @Field()
  name: string;

  @Field()
  @ValidateNested()
  source: RelationshipEdge;

  @Field()
  @ValidateNested()
  target: RelationshipEdge;
}
