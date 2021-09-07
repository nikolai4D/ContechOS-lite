import { BadRequestException, Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { Utilities } from 'src/utilities/Utilities';
import { CreateRelationshipInput } from './dto/create-relationship.input';
import { UpdateRelationshipInput } from './dto/update-relationship.input';
import { Relationship } from './entities/relationship.entity';

@Injectable()
export class RelationshipsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  create(createRelationshipInput: CreateRelationshipInput) {
    return 'This action adds a new relationship';
  }

  async findAll(from: string, to: string) {
    if (!Utilities.isValidNeo4jLabel(from) || !Utilities.isValidNeo4jLabel(to)) {
      throw new BadRequestException();
    }

    const result = await this.neo4jService.read(
      `
      MATCH (from:${from})-[rel]->(to:${to})
      RETURN from, rel, to
      `
    );

    return result.records.map(record => {
      const { properties: from } = record.get("from");
      const { properties: rel, type: name } = record.get("rel");
      const { properties: to } = record.get("to");

      console.log(new Relationship({
        id: rel.id,
        name,
        source: { id: from.id },
        target: { id: to.id },
      }));

      return new Relationship({
        id: rel.id,
        name,
        source: { id: from.id },
        target: { id: to.id },
      });
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} relationship`;
  }

  update(id: number, updateRelationshipInput: UpdateRelationshipInput) {
    return `This action updates a #${id} relationship`;
  }

  remove(id: number) {
    return `This action removes a #${id} relationship`;
  }
}
