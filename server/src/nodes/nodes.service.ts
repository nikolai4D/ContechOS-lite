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
import { ValidationService } from '../utilities/validation.service';

@Injectable()
export class NodesService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly validationService: ValidationService,
  ) {}

  async create(createNodeInput: CreateNodeInput): Promise<Node | void> {
    if (!createNodeInput.labels || createNodeInput.labels.length === 0) {
      throw new BadRequestException();
    }
    // TODO: if CONFIG OR DATA: exact two labels, second label not allowed to be one of the predefined labels
    // TODO: if PROPERTY_VALUE, PROPERTY_KEY or DATATYPE: exact one label
    // TODO: Labels contains none of the predefined labels

    const label: string = createNodeInput.labels.filter((data: string) =>
      Config.NODETYPE.includes(data),
    )[0];
    switch (label) {
      case Config.CONFIG:
        if (!this.validationService.validateConfigNode(createNodeInput)) {
          throw new BadRequestException();
        }
        const allowedConfgIds = await Promise.all(
          createNodeInput.properties['allowedConfigIds'].map(
            async (item: string): Promise<Node | null> => this.findOne(item),
          ),
        );
        if (allowedConfgIds.includes(null)) {
          throw new BadRequestException();
        }
        const allowedPropertyKeyIds = await Promise.all(
          createNodeInput.properties['allowedPropertyKeyIds'].map(
            async (item: string): Promise<Node | null> => this.findOne(item),
          ),
        );
        if (allowedPropertyKeyIds.includes(null)) {
          throw new BadRequestException();
        }

        break;
      case Config.DATA:
        // TODO: validate against coresponding Config Node
        if (!this.validationService.validateDataNode(createNodeInput)) {
          throw new BadRequestException();
        }

        const pickedPropertyKeyIds = await Promise.all(
          Object.keys(createNodeInput.properties)
            .filter((data: any) => data !== 'allowedConfigIds')
            .map(
              async (item: string): Promise<Node | null> => this.findOne(item),
            ),
        );
        if (pickedPropertyKeyIds.includes(null)) {
          throw new BadRequestException();
        }

        const propertyValueIds = Object.keys(createNodeInput.properties)
          .filter((data: any) => data !== 'allowedConfigIds')
          .map((data: any) => createNodeInput.properties[data]);

        const pickedPropertyValueIds = await Promise.all(
          propertyValueIds.map(
            async (item: string): Promise<Node | null> => this.findOne(item),
          ),
        );
        if (pickedPropertyValueIds.includes(null)) {
          throw new BadRequestException();
        }

        break;
      case Config.PROPERTY_VALUE:
        if (
          !this.validationService.validatePropertyValueNode(createNodeInput)
        ) {
          throw new BadRequestException();
        }
        await this.findOne(createNodeInput.properties['propertyKeyId']).then(
          (resultNode) => {
            if (!resultNode) {
              throw new BadRequestException();
            }
          },
        );
        break;
      case Config.PROPERTY_KEY:
        if (!this.validationService.validatePropertyKeyNode(createNodeInput)) {
          throw new BadRequestException();
        }
        await this.findOne(createNodeInput.properties['datatypeId']).then(
          (resultNode) => {
            if (!resultNode) {
              throw new BadRequestException();
            }
          },
        );
        break;
      case Config.DATATYPE:
        if (!this.validationService.validateDatatypeNode(createNodeInput)) {
          throw new BadRequestException();
        }
        break;
      default:
        throw new BadRequestException();
    }
    if (!createNodeInput.labels.every(Utilities.isValidNeo4jLabel)) {
      throw new BadRequestException();
    }

    if (
      createNodeInput.labels.some((resultLabel) =>
        Config.FORBIDDEN_GENERIC_NODE_LABELS.includes(resultLabel),
      )
    ) {
      throw new ForbiddenException();
    }

    if (
      Object.keys(createNodeInput.properties).some((property) =>
        Config.FORBIDDEN_NODE_PROPERTIES_TO_UPDATE.includes(property),
      )
    ) {
      throw new BadRequestException();
    }

    const result = await this.neo4jService.write(
      `
      MERGE (n${createNodeInput.labels
        .map((label) => `:${label}`)
        .join('')} { id: $id })
      SET n += $properties
      SET n.createdAt = datetime(), n.updatedAt = datetime()
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

    const { labels, properties } = record?.get('n');

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

    // Block updates for any node with a forbidden label (like User)
    // For this nodes, if updatable, a separate endpoint will be exposed
    if (
      node.labels.some((label) =>
        Config.FORBIDDEN_GENERIC_NODE_LABELS.includes(label),
      )
    ) {
      throw new ForbiddenException();
    }

    const result = await this.neo4jService.write(
      `
      MATCH (n { id: $id })
      ${node.labels.map((label) => `REMOVE n:${label}`).join('\n')}
      ${
        updateNodeInput.labels !== undefined
          ? `SET n:${[...(updateNodeInput.labels ?? [])].join(':')}`
          : ''
      }
      ${updateNodeInput.properties !== undefined ? 'SET n = $properties' : ''}
      ${
        updateNodeInput.labels !== undefined ||
        updateNodeInput.properties !== undefined
          ? 'SET n.updatedAt = datetime()'
          : ''
      }
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
