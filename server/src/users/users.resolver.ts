import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }

    return user;
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }

    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => GraphQLDeleteResult)
  @UseGuards(JwtAuthGuard)
  removeUser(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }

    return this.usersService.remove(id);
  }
}
