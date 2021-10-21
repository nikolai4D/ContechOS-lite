import { ObjectType, Field, HideField, ID } from '@nestjs/graphql';
import { Role } from './role.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @HideField()
  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  role: Role;

  constructor(data: User) {
    Object.assign(this, {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: new Role(data.role),
    });
  }
}
