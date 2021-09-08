import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';
import { Utilities } from 'src/utilities/Utilities';
import { CreateNodeInput } from './dto/create-node.input';
import { UpdateNodeInput } from './dto/update-node.input';
import { Node } from './entities/node.entity';

@Injectable()
export class NodesService {
  constructor (private readonly neo4jService: Neo4jService) {}

  async create(createNodeInput: CreateNodeInput): Promise<Node> {
    if (!createNodeInput.labels.every(Utilities.isValidNeo4jLabel)) {
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

    return new Node({
      id: rel.id,
      name,
      source: { id: from.id },
      target: { id: to.id },
    });
  }

  async findAll(): Promise<Node[]> {
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

      return new Node({
        id: rel.id,
        name,
        source: { id: from.id },
        target: { id: to.id },
      });
    });
  }

  async findOne(id: string): Promise<Node | null> {
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

    return new Node({
      id: rel.id,
      name,
      source: { id: from.id },
      target: { id: to.id },
    });
  }

  async update(id: string, updateNodeInput: UpdateNodeInput): Promise<Node> {
    if (updateNodeInput.labels && !updateNodeInput.labels.every(Utilities.isValidNeo4jLabel)) {
      throw new BadRequestException();
    }

    return new Node({ id: "123", labels: ["User", "Admin"] });
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
