import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';
import { Utilities } from 'src/utilities/Utilities';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { UpdateRelationshipInput } from './dto/update-relationship.input';
import { Relationship } from './entities/relationship.entity';

@Injectable()
export class RelationshipsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createRelationshipInput: CreateRelationshipInput): Promise<Relationship> {
    if (!Utilities.isValidNeo4jRelationshipType(createRelationshipInput.name)) {
      throw new BadRequestException();
    }

    const result = await this.neo4jService.write(
      `
      MERGE (from { id: $from })-[rel:${createRelationshipInput.name}]->(to { id: $to })
      CREATE (u:User {
        id: $id,
        name: $name,
        email: $email,
        password: $password,
        createdAt: datetime(),
        updatedAt: datetime()
      })-[:HAS_ROLE { id: $relationshipId }]->(r)
      RETURN u, r
      `,
      {
        id: randomUUID(),
        name: createUserInput.name,
        email: createUserInput.email,
        password,
        relationshipId: randomUUID(),
      },
    );

    const record =  result.records.at(0);

    if (!record) {
      throw new InternalServerErrorException();
    }

    const { properties: from } = record.get('from');
    const { properties: rel, type: name } = record.get('rel');
    const { properties: to } = record.get('to');

    return new Relationship({
      id: rel.id,
      name,
      source: { id: from.id },
      target: { id: to.id },
    });
  }

  async findAll(from: string, to: string): Promise<Relationship[]> {
    if (
      !Utilities.isValidNeo4jLabel(from) ||
      !Utilities.isValidNeo4jLabel(to)
    ) {
      throw new BadRequestException();
    }

    const result = await this.neo4jService.read(
      `
      MATCH (from:${from})-[rel]->(to:${to})
      RETURN from, rel, to
      `,
    );

    return result.records.map((record) => {
      const { properties: from } = record.get('from');
      const { properties: rel, type: name } = record.get('rel');
      const { properties: to } = record.get('to');

      return new Relationship({
        id: rel.id,
        name,
        source: { id: from.id },
        target: { id: to.id },
      });
    });
  }

  async findOne(id: string): Promise<Relationship | null> {
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[rel { id: $id }]->(to)
      RETURN from, rel, to
      `,
      { id },
    );

    const record = result.records.at(0);

    if (!record) {
      return null;
    }

    const { properties: from } = record.get('from');
    const { properties: rel, type: name } = record.get('rel');
    const { properties: to } = record.get('to');

    return new Relationship({
      id: rel.id,
      name,
      source: { id: from.id },
      target: { id: to.id },
    });
  }

  async update(id: string, updateRelationshipInput: UpdateRelationshipInput): Promise<Relationship> {
    const relationship = await this.findOne(id);

    if (!relationship) {
      throw new NotFoundException();
    }

    const result = await this.neo4jService.write(
      `
      MATCH (u:User { id: $id })-[:HAS_ROLE]->(r:Role)
      SET u += {
        name: $name,
        email: $email,
        password: $password,
        updatedAt: datetime()
      }
      RETURN u, r
      `,
      {
        id,
        name: updateUserInput.name ?? user.name,
        email: updateUserInput.email ?? user.email,
        password: updateUserInput.password ?? user.password,
      },
    );

    const newUser = {
      ...result.records.at(0)?.get('u').properties,
      role: result.records.at(0)?.get('r').properties,
    };

    return new User(newUser);
  }

  async remove(id: string): Promise<GraphQLDeleteResult> {
    let success = true;

    try {
      await this.neo4jService.write(
        `
        MATCH ()-[rel { id: $id }]->()
        DELETE rel
        `,
        { id },
      );
    } catch {
      success = false;
    }

    return new GraphQLDeleteResult({ success });
  }
}
