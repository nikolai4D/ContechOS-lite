import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesResolver } from './nodes.resolver';

@Module({
  providers: [NodesResolver, NodesService],
})
export class NodesModule {}
