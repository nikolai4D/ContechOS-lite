import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RelationshipsService } from './relationships.service';
import { Relationship } from './entities/relationship.entity';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Resolver(() => Relationship)
@UseGuards(JwtAuthGuard)
export class RelationshipsResolver {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Mutation(() => Relationship)
  createRelationship(
    @Args('createRelationshipInput')
    createRelationshipInput: CreateRelationshipInput,
  ) {
    return this.relationshipsService.create(createRelationshipInput);
  }

  @Query(() => [Relationship], { name: 'relationships' })
  findAll(@Args('from') from: string, @Args('to') to: string) {
    return this.relationshipsService.findAll(from, to);
  }

  @Query(() => Relationship, { name: 'relationship' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.relationshipsService.findOne(id);
  }

  @Mutation(() => Relationship)
  removeRelationship(@Args('id', { type: () => String }) id: string) {
    return this.relationshipsService.remove(id);
  }
}
