import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class RelationshipEdgeDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  labels: string[];
}
