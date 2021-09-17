import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NodesService } from './nodes.service';
import { Node } from './entities/node.entity';
import { CreateNodeInput } from './dto/create-node.input';
import { UpdateNodeInput } from './dto/update-node.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';

@Resolver(() => Node)
@UseGuards(JwtAuthGuard)
export class NodesResolver {
  constructor(private readonly nodesService: NodesService) {}

  @Mutation(() => Node) // `() => Node` specifies the return type of the mutation / query
  createNode(@Args('createNodeInput') createNodeInput: CreateNodeInput) {
    return this.nodesService.create(createNodeInput);
  }

  /*
    `{ name: 'nodes' }` overrides the defaul name of the query
    that would be the name of the method, in this case `findAll`.
  */
  @Query(() => [Node], { name: 'nodes' })
  findAll() {
    return this.nodesService.findAll();
  }

  @Query(() => Node, { name: 'node' })
  async findOne(@Args('id') id: string) {
    const node = await this.nodesService.findOne(id);

    if (!node) {
      throw new NotFoundException();
    }

    return node;
  }

  @Mutation(() => Node)
  updateNode(
    @Args('id') id: string,
    @Args('updateNodeInput') updateNodeInput: UpdateNodeInput,
  ) {
    return this.nodesService.update(id, updateNodeInput);
  }

  @Mutation(() => GraphQLDeleteResult)
  removeNode(@Args('id') id: string) {
    return this.nodesService.remove(id);
  }
}
