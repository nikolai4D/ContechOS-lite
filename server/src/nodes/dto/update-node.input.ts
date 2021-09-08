import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsOptional } from 'class-validator';

@InputType()
export class UpdateNodeInput {
  @Field(() => [String])
  @ArrayMinSize(1)
  @IsOptional()
  labels?: string[];
}
