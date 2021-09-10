import { Module } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { RelationshipsResolver } from './relationships.resolver';

@Module({
  providers: [RelationshipsResolver, RelationshipsService],
})
export class RelationshipsModule {}
