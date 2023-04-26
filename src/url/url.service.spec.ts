import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { MemoryDatabaseModule } from 'src/shared/database/memory/memorydb.module';
import { VisitsService } from './visits.service';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryDatabaseModule],
      providers: [UrlService, VisitsService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
