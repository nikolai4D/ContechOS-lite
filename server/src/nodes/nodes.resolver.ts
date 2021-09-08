import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NodesService } from './nodes.service';
import { Node } from './entities/node.entity';
import { CreateNodeInput } from './dto/create-node.input';
import { UpdateNodeInput } from './dto/update-node.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Resolver(() => Node)
@UseGuards(JwtAuthGuard)
export class NodesResolver {
  constructor(private readonly nodesService: NodesService) {}

  @Mutation(() => Node)
  createNode(@Args('createNodeInput') createNodeInput: CreateNodeInput) {
    return this.nodesService.create(createNodeInput);
  }

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
  updateNode(@Args('id') id: string, @Args('updateNodeInput') updateNodeInput: UpdateNodeInput) {
    return this.nodesService.update(id, updateNodeInput);
  }

  @Mutation(() => Node)
  removeNode(@Args('id') id: string) {
    return this.nodesService.remove(id);
  }
}
