import { Test, TestingModule } from '@nestjs/testing';
import { NodesResolver } from './nodes.resolver';
import { NodesService } from './nodes.service';

describe('NodesResolver', () => {
  let resolver: NodesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodesResolver, NodesService],
    }).compile();

    resolver = module.get<NodesResolver>(NodesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
