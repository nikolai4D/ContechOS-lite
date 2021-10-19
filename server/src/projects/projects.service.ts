import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateProjectInput } from './dto/create-project.input';

@Injectable()
export class ProjectsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createProject(createProject: CreateProjectInput): Promise<void> {
    const result = await this.neo4jService.write(
      `
      CREATE (p:Project {
        what: $what,
        why: $why,
        createdAt: datetime(),
        updatedAt: datetime()
      })
      RETURN p`,
      {
        what: createProject.what,
        why: createProject.why,
      },
    );
    /*    const project = {
          ...result.records.at(0)?.get('p').properties,
        };
        return new Project(project);*/
  }
}
