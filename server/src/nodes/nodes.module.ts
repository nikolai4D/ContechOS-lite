import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesResolver } from './nodes.resolver';
import { ValidationService } from '../utilities/validation.service';

@Module({
  providers: [NodesResolver, NodesService, ValidationService],
})
export class NodesModule {}
