import { Global, Module } from '@nestjs/common';
import { MemoryDatabaseService } from './memorydb.service';

@Global()
@Module({
  providers: [MemoryDatabaseService],
  exports: [MemoryDatabaseService],
})
export class MemoryDatabaseModule {}
