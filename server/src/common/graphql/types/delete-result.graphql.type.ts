import { ObjectType, Field } from '@nestjs/graphql';

/**
 * This defines the response type for every remove* mutation.
 */
@ObjectType()
export class GraphQLDeleteResult {
  @Field()
  success: boolean;

  constructor(data: GraphQLDeleteResult) {
    Object.assign(this, {
      success: data.success,
    });
  }
}
