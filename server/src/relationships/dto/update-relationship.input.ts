import { CreateRelationshipInput } from './create-relationship.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRelationshipInput extends PartialType(
  CreateRelationshipInput,
) {
  @Field(() => Int)
  id: number;
}
