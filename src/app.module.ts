import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { MemoryDatabaseModule } from './shared/database/memory/memorydb.module';

@Module({
  imports: [MemoryDatabaseModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
