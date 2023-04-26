import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { MemoryDatabaseModule } from 'src/shared/database/memory/memorydb.module';
import { VisitsService } from './visits.service';

jest.mock('./url.service.ts');
describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryDatabaseModule],
      controllers: [UrlController],
      providers: [UrlService, VisitsService],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should encode a URL', async () => {
    const mockBody = { url: 'https://www.example.com' };
    jest.spyOn(service, 'encodeURL').mockImplementation(() => Promise.resolve({} as any));
    await controller.encode(mockBody);
    expect(service.encodeURL).toBeCalledWith(mockBody);
  });

  it('should decode a URL', async () => {
    const req = { ip: '127.0.0.1', headers: {} } as Request;
    const shortId = 'ABCDEFGHIJ';
    jest.spyOn(service, 'decodeURL').mockImplementation(() => Promise.resolve({} as any));
    await controller.decode(shortId, req);
    expect(service.decodeURL).toBeCalledWith({ shortId, req });
  });

  it('should get statistics for a URL', async () => {
    const shortId = 'ABCDEFGHIJ';
    jest.spyOn(service, 'getStatisticsForShortId').mockImplementation(() => Promise.resolve({} as any));
    await controller.statistics(shortId);
    expect(service.getStatisticsForShortId).toBeCalledWith({ shortId });
  });
});
