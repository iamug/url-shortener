import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UrlService } from './url.service';
import { MemoryDatabaseModule } from 'src/shared/database/memory/memorydb.module';
import { VisitsService } from './visits.service';
import { MemoryDatabaseService } from 'src/shared/database/memory/memorydb.service';
import { Url } from './entities/url.entity';
import { NotFoundException } from '@nestjs/common';

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

  it('should encode a url', async () => {
    const input = { url: 'https://example.com' };
    const result = await service.encodeURL(input);
    expect(result).toHaveProperty('shortId');
    expect(result).toHaveProperty('originalUrl', input.url);
    expect(result).toHaveProperty('url');
  });

  it('should generate a unique shortId', async () => {
    const input = { url: 'https://example.com' };
    const results = await Promise.all([service.encodeURL(input), service.encodeURL(input), service.encodeURL(input)]);
    const shortIds = results.map((result) => result.shortId);
    expect(shortIds).toHaveLength(3);
    expect(new Set(shortIds).size).toBe(3);
  });

  it('should decode a shortId', async () => {
    const req = { ip: '127.0.0.1', headers: {} } as Request;
    const input = { url: 'https://example.com' };
    const encodeResponse = await service.encodeURL(input);
    const result = await service.decodeURL({ shortId: encodeResponse.shortId, req });
    expect(result).toHaveProperty('originalUrl', 'https://example.com');
  });

  it('should throw NotFoundException when the shortId does not exist', async () => {
    const shortId = 'notfound';
    const req = { ip: '127.0.0.1', headers: {} } as Request;
    await expect(service.decodeURL({ shortId, req })).rejects.toThrowError(NotFoundException);
  });

  it('should return statistics for valid url', async () => {
    const req = { ip: '127.0.0.1', headers: {} } as Request;
    const input = { url: 'https://example.com' };
    const encodeResponse = await service.encodeURL(input);
    [...Array(4)].map(async () => await service.decodeURL({ shortId: encodeResponse.shortId, req }));
    const result = await service.getStatisticsForShortId({ shortId: encodeResponse.shortId });
    await expect(result).toHaveProperty('visits', 4);
    await expect(result).toHaveProperty('topIps');
    await expect(result).toHaveProperty('topUserAgents');
  });
});
