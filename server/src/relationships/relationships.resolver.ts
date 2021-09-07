import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RelationshipsService } from './relationships.service';
import { Relationship } from './entities/relationship.entity';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { UpdateRelationshipInput } from './dto/update-relationship.input';

@Resolver(() => Relationship)
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
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.relationshipsService.findOne(id);
  }

  @Mutation(() => Relationship)
  updateRelationship(
    @Args('updateRelationshipInput')
    updateRelationshipInput: UpdateRelationshipInput,
  ) {
    return this.relationshipsService.update(
      updateRelationshipInput.id,
      updateRelationshipInput,
    );
  }

  @Mutation(() => Relationship)
  removeRelationship(@Args('id', { type: () => Int }) id: number) {
    return this.relationshipsService.remove(id);
  }
}
