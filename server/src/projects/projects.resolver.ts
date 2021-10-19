import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.input';
import { Project } from './entities/project.entity';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectService: ProjectsService) {}

  @Mutation(() => Project)
  createProject(@Args('createProject') createProject: CreateProjectInput) {
    return this.projectService.createProject(createProject);
  }
}
