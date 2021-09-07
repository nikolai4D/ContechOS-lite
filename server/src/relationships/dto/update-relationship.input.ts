import { CreateRelationshipInput } from './create-relationship.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRelationshipInput extends PartialType(
  CreateRelationshipInput,
) {
  @Field(() => ID)
  id: string;
}
