import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Neo4jService } from 'nest-neo4j/dist';
import { GraphQLDeleteResult } from 'src/common/graphql/types/delete-result.graphql.type';
import { Config } from 'src/config/Config';
import { Utilities } from 'src/utilities/Utilities';
import { CreateNodeInput } from './dto/create-node.input';
import { UpdateNodeInput } from './dto/update-node.input';
import { Node } from './entities/node.entity';

@Injectable()
export class NodesService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createNodeInput: CreateNodeInput): Promise<Node> {
    if (!createNodeInput.labels.every(Utilities.isValidNeo4jLabel)) {
      throw new BadRequestException();
    }

    if (
      createNodeInput.labels.some((label) =>
        Config.FORBIDDEN_GENERIC_NODE_LABELS.includes(label),
      )
    ) {
      throw new ForbiddenException();
    }

    const result = await this.neo4jService.write(
      `
      MERGE (n${createNodeInput.labels
        .map((label) => `:${label}`)
        .join('')} { id: $id })
      SET n = $properties
      RETURN n
      `,
      {
        id: randomUUID(),
        properties: createNodeInput.properties,
      },
    );

    const record = result.records.at(0);

    if (!record) {
      throw new InternalServerErrorException();
    }

    const { labels, properties } = record.get('n');

    return new Node({
      id: properties.id,
      labels,
      properties,
    });
  }

  async findAll(): Promise<Node[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (n)
      RETURN n
      `,
    );

    return result.records.map((record) => {
      const { labels, properties } = record.get('n');

      return new Node({
        id: properties.id,
        labels,
        properties,
      });
    });
  }

  async findOne(id: string): Promise<Node | null> {
    const result = await this.neo4jService.read(
      `
      MATCH (n { id: $id })
      RETURN n
      `,
      { id },
    );

    const record = result.records.at(0);

    if (!record) {
      return null;
    }

    const { labels, properties } = record.get('n');

    return new Node({
      id: properties.id,
      labels,
      properties,
    });
  }

  async update(id: string, updateNodeInput: UpdateNodeInput): Promise<Node> {
    if (updateNodeInput.labels) {
      if (!updateNodeInput.labels.every(Utilities.isValidNeo4jLabel)) {
        throw new BadRequestException();
      }

      if (
        updateNodeInput.labels.some((label) =>
          Config.FORBIDDEN_GENERIC_NODE_LABELS.includes(label),
        )
      ) {
        throw new ForbiddenException();
      }
    }

    if (
      updateNodeInput.properties &&
      Object.keys(updateNodeInput.properties).some((property) =>
        Config.FORBIDDEN_NODE_PROPERTIES_TO_UPDATE.includes(property),
      )
    ) {
      throw new BadRequestException();
    }

    const node = await this.findOne(id);

    if (!node) {
      throw new InternalServerErrorException();
    }

    // TODO: Check that node is not a user or a role

    const result = await this.neo4jService.write(
      `
      MATCH (n { id: $id })
      ${
        updateNodeInput.labels !== undefined
          ? `SET n:${[...(updateNodeInput.labels ?? [])].join(':')}`
          : ''
      }
      ${updateNodeInput.properties !== undefined ? 'SET n = $properties' : ''}
      RETURN n
      `,
      {
        id,
        properties: {
          ...updateNodeInput.properties,
          ...Object.fromEntries(
            Config.FORBIDDEN_NODE_PROPERTIES_TO_UPDATE.map((property) => [
              property,
              node.properties[property],
            ]),
          ),
        },
      },
    );

    const record = result.records.at(0);

    if (!record) {
      throw new InternalServerErrorException();
    }

    const { labels, properties } = record.get('n');

    return new Node({
      id: properties.id,
      labels,
      properties,
    });
  }

  async remove(id: string): Promise<GraphQLDeleteResult> {
    let success = true;

    try {
      await this.neo4jService.write(
        `
        MATCH (n { id: $id })
        DELETE n
        `,
        { id },
      );
    } catch {
      success = false;
    }

    return new GraphQLDeleteResult({ success });
  }
}
