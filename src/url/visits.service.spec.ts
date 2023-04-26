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

  const input = {
    shortId: 'ABCDEFGHIJ',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    referer: 'https://google.com',
  };

  it('should save a visit', async () => {
    const result = service.saveVisits(input);
  });

  it('should fetch visits for shortId', async () => {
    service.saveVisits(input);
    const result = service.getVisitsForShortId(input.shortId);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0]).toHaveProperty('shortId', input.shortId);
    expect(result[0]).toHaveProperty('ip', input.ip);
    expect(result[0]).toHaveProperty('userAgent', input.userAgent);
  });

  it('should fetch top ips and userAgent for shortId', async () => {
    service.saveVisits(input);
    [...Array(4)].map(async () => await service.saveVisits(input));
    const result = service.getTopIpsAndUserAgentForShortId(input.shortId);
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('topIps');
    expect(result).toHaveProperty('topUserAgents');
    expect(result.topIps).toBeInstanceOf(Array);
    expect(result.topUserAgents).toBeInstanceOf(Array);
    expect(result.topIps[0]).toBeInstanceOf(Object);
    expect(result.topUserAgents[0]).toBeInstanceOf(Object);
    expect(result.topIps[0]).toHaveProperty('ip', input.ip);
    expect(result.topUserAgents[0]).toHaveProperty('userAgent', input.userAgent);
  });
});
