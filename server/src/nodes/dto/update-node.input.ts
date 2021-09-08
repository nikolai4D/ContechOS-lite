import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateNodeInput {
  @Field(() => [String])
  @IsOptional()
  labels?: string[];
}
