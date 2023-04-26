import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { MemoryDatabaseModule } from 'src/shared/database/memory/memorydb.module';
import { VisitsService } from './visits.service';

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryDatabaseModule],
      controllers: [UrlController],
      providers: [UrlService, VisitsService],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
