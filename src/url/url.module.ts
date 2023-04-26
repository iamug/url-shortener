import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { VisitsService } from './visits.service';

@Module({
  controllers: [UrlController],
  providers: [UrlService, VisitsService],
})
export class UrlModule {}
