import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DateTime } from 'neo4j-driver';
import { Utilities } from 'src/utilities/Utilities';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  why: string;

  @Field()
  what: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(data: Project) {
    Object.assign(this, {
      id: data.id,
      why: data.why,
      what: data.what,
      createdAt: Utilities.neo4jDateTimeToDateObject(
        data.createdAt as unknown as DateTime,
      ),
      updatedAt: Utilities.neo4jDateTimeToDateObject(
        data.updatedAt as unknown as DateTime,
      ),
    });
  }
}
