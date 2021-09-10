import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Neo4jService } from 'nest-neo4j';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';
import { Config } from 'src/config/Config';
import { Utilities } from 'src/utilities/Utilities';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { UpdateRelationshipInput } from './dto/update-relationship.input';
import { Relationship } from './entities/relationship.entity';

@Injectable()
export class RelationshipsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    createRelationshipInput: CreateRelationshipInput,
  ): Promise<Relationship> {
    if (!Utilities.isValidNeo4jRelationshipType(createRelationshipInput.name)) {
      throw new BadRequestException();
    }

    const result = await this.neo4jService.write(
      `
      MERGE (from { id: $from })-[rel:${createRelationshipInput.name} {
        id: $id
      }]->(to { id: $to })
      RETURN from, rel, to
      `,
      {
        id: randomUUID(),
      },
    );

    const record = result.records.at(0);

    if (!record) {
      throw new InternalServerErrorException();
    }

    const { properties: from } = record.get('from');
    const { properties: rel, type: name } = record.get('rel');
    const { properties: to } = record.get('to');

    return new Relationship({
      id: rel.id,
      name,
      properties: rel,
      source: { id: from.id },
      target: { id: to.id },
    });
  }

  async findAll(from?: string, to?: string): Promise<Relationship[]> {
    if (
      (from && !Utilities.isValidNeo4jLabel(from)) ||
      (to && !Utilities.isValidNeo4jLabel(to))
    ) {
      throw new BadRequestException();
    }

    const result = await this.neo4jService.read(
      `
      MATCH (from${typeof from === 'string' ? `:${from}` : ''})-[rel]->(to${
        typeof to === 'string' ? `:${to}` : ''
      })
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
        properties: rel,
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
      properties: rel,
      source: { id: from.id },
      target: { id: to.id },
    });
  }

  async update(
    id: string,
    updateRelationshipInput: UpdateRelationshipInput,
  ): Promise<Relationship> {
    if (
      updateRelationshipInput.properties &&
      Object.keys(updateRelationshipInput.properties).some((property) =>
        Config.FORBIDDEN_RELATIONSHIP_PROPERTIES_TO_UPDATE.includes(property),
      )
    ) {
      throw new BadRequestException();
    }

    const relationship = await this.findOne(id);

    if (!relationship) {
      throw new NotFoundException();
    }

    const result = await this.neo4jService.write(
      `
      MATCH (from)-[rel]->(to)
      ${
        updateRelationshipInput.properties !== undefined
          ? 'SET n = $properties'
          : ''
      }
      RETURN n
      `,
      {
        id,
        properties: {
          ...updateRelationshipInput.properties,
          ...Object.fromEntries(
            Config.FORBIDDEN_RELATIONSHIP_PROPERTIES_TO_UPDATE.map(
              (property) => [property, relationship.properties[property]],
            ),
          ),
        },
      },
    );

    const record = result.records.at(0);

    if (!record) {
      throw new InternalServerErrorException();
    }

    const { properties: from } = record.get('from');
    const { properties: rel, type: name } = record.get('rel');
    const { properties: to } = record.get('to');

    return new Relationship({
      id: rel.id,
      name,
      properties: rel,
      source: { id: from.id },
      target: { id: to.id },
    });
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
