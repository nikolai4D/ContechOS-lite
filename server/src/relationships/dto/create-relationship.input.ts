import { InputType, Field } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { RelationshipEdgeDto } from './relationship-edge.dto';

@InputType()
export class CreateRelationshipInput {
  @Field()
  name: string;

  @Field(() => RelationshipEdgeDto)
  @ValidateNested()
  source: RelationshipEdgeDto;

  @Field(() => RelationshipEdgeDto)
  @ValidateNested()
  target: RelationshipEdgeDto;
}
