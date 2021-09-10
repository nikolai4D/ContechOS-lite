import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RelationshipsService } from './relationships.service';
import { Relationship } from './entities/relationship.entity';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateRelationshipInput } from './dto/update-relationship.input';

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
  findAll(
    @Args('from', { nullable: true }) from?: string,
    @Args('to', { nullable: true }) to?: string,
  ) {
    return this.relationshipsService.findAll(from, to);
  }

  @Query(() => Relationship, { name: 'relationship' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    const relationship = await this.relationshipsService.findOne(id);

    if (!relationship) {
      throw new NotFoundException();
    }

    return relationship;
  }

  @Mutation(() => Node)
  updateRelationship(
    @Args('id') id: string,
    @Args('updateRelationshipInput')
    updateRelationshipInput: UpdateRelationshipInput,
  ) {
    return this.relationshipsService.update(id, updateRelationshipInput);
  }

  @Mutation(() => Relationship)
  removeRelationship(@Args('id', { type: () => String }) id: string) {
    return this.relationshipsService.remove(id);
  }
}
