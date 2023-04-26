import { Test, TestingModule } from '@nestjs/testing';
import { MemoryDatabaseModule } from 'src/shared/database/memory/memorydb.module';
import { VisitsService } from './visits.service';

describe('VisitsService', () => {
  let service: VisitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryDatabaseModule],
      providers: [VisitsService],
    }).compile();

    service = module.get<VisitsService>(VisitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
