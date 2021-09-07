import { BadRequestException, Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';
import { Utilities } from 'src/utilities/Utilities';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { UpdateRelationshipInput } from './dto/update-relationship.input';
import { Relationship } from './entities/relationship.entity';

@Injectable()
export class RelationshipsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  create(createRelationshipInput: CreateRelationshipInput): Promise<Relationship> {
    return 'This action adds a new relationship';
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
    return `This action updates a #${id} relationship`;
  }

  async remove(id: string): Promise<GraphQLDeleteResult> {
    return `This action removes a #${id} relationship`;
  }
}
