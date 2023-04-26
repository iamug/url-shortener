import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryDatabaseService } from 'src/shared/database/memory/memorydb.service';
import { Url } from './entities/url.entity';
import { randomURLSafeCharacters } from 'src/shared/utils/helper.utils';
import { EncodeUrlDto } from './dto/encode-url.dto';
import { DecodeResponseDto, EncodeResponseDto, StatisticsResponseDto, VisitsResponseDto } from './dto/url-response.dto';
import { Request } from 'express';
import { VisitsService } from './visits.service';

@Injectable()
export class UrlService {
  constructor(private readonly urlDatabase: MemoryDatabaseService<Url>, private readonly visitsService: VisitsService) {
    this.urlDatabase = new MemoryDatabaseService();
  }

  private generateShortId(): string {
    const shortId = randomURLSafeCharacters(10);
    const shortIdExists = this.urlDatabase.findOneByProperty('shortId', shortId);
    if (shortIdExists) {
      return this.generateShortId();
    }
    return shortId;
  }

  encodeURL(input: EncodeUrlDto): Promise<EncodeResponseDto | never> {
    try {
      const { url: longUrl } = input;
      const shortId = this.generateShortId();
      const newObject = new Url({ shortId, longUrl });
      this.urlDatabase.add(newObject);
      return Promise.resolve(new EncodeResponseDto({ ...newObject }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  decodeURL(input: { shortId: string; req: Request }): Promise<DecodeResponseDto | never> {
    try {
      const { shortId, req } = input;
      const { ip } = req;
      const userAgent = req.headers['user-agent'];
      const referer = req.headers.referer;
      const shortIdData = this.urlDatabase.findOneByProperty('shortId', shortId);
      if (!shortIdData) throw new NotFoundException('Short URL does not exist.');
      this.urlDatabase.updateOneByProperty({ prop: 'shortId', value: shortId }, { visits: shortIdData.visits + 1, lastVisisted: new Date().toISOString() });
      this.visitsService.saveVisits({ shortId, ip, userAgent, referer });
      return Promise.resolve(new DecodeResponseDto(shortIdData));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getVisitsForShortId(input: Record<'shortId', string>): Promise<VisitsResponseDto[] | never> {
    try {
      const { shortId } = input;
      const shortIdVisits = this.visitsService.getVisitsForShortId(shortId);
      return Promise.resolve(shortIdVisits.map((visit) => new VisitsResponseDto(visit)));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getStatisticsForShortId(input: Record<'shortId', string>): Promise<StatisticsResponseDto | never> {
    try {
      const { shortId } = input;
      const shortIdData = this.urlDatabase.findOneByProperty('shortId', shortId);
      if (!shortIdData) throw new NotFoundException('Short URL does not exist.');
      const { topIps, topUserAgents } = this.visitsService.getTopIpsAndUserAgentForShortId(shortId);
      return Promise.resolve(new StatisticsResponseDto({ visits: shortIdData.visits, topIps, topUserAgents }));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
