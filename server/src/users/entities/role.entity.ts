import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => ID)
  id: string;

  constructor(data: Role) {
    Object.assign(this, {
      id: data.id,
    });
  }
}
