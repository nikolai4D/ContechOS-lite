import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateNodeInput {
  @Field(() => [String])
  labels: string[];
}
