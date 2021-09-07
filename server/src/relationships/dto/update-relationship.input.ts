import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, ValidateNested } from 'class-validator';
import { RelationshipEdge } from '../entities/relationship-edge.entity';

@InputType()
export class UpdateRelationshipInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @ValidateNested()
  @IsOptional()
  source?: RelationshipEdge;

  @Field({ nullable: true })
  @ValidateNested()
  @IsOptional()
  target?: RelationshipEdge;
}
