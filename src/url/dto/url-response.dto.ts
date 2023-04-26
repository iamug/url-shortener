import { ApiProperty } from '@nestjs/swagger';
import appConfig from '../../shared/config/index.config';
import { Url } from '../entities/url.entity';
import { Visits } from '../entities/visits.entity';

export class DecodeResponseDto {
  @ApiProperty()
  originalUrl: string;

  constructor(data: Partial<Url>) {
    this.originalUrl = data.longUrl;
  }
}

export class EncodeResponseDto {
  @ApiProperty()
  shortId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  originalUrl: string;

  constructor(data: Partial<Url>) {
    this.shortId = data.shortId;
    this.url = `${appConfig().BASEURL}s/${data.shortId}`;
    this.originalUrl = data.longUrl;
  }
}

export class VisitsResponseDto {
  @ApiProperty()
  shortId: string;

  @ApiProperty()
  ip: string;

  @ApiProperty()
  userAgent: string;

  @ApiProperty({ nullable: true })
  referer: string;

  @ApiProperty({ type: Date })
  date: Date | string;

  constructor(data: Partial<Visits>) {
    this.shortId = data.shortId;
    this.ip = data.ip;
    this.userAgent = data.userAgent;
    this.referer = data.referer;
    this.date = data.visitDate;
  }
}

class TopIp {
  @ApiProperty({ type: String })
  ip: Visits['ip'];

  @ApiProperty()
  count: number;
}

class TopUserAgent {
  @ApiProperty({ type: String })
  userAgent: Visits['userAgent'];

  @ApiProperty()
  count: number;
}

export class StatisticsResponseDto {
  @ApiProperty()
  visits: Url['visits'];

  @ApiProperty({ type: TopIp, isArray: true })
  topIps: TopIp[];

  @ApiProperty({ type: TopUserAgent, isArray: true })
  topUserAgents: TopUserAgent[];

  constructor(data: Pick<Url, 'visits'> & { topIps: TopIp[]; topUserAgents: TopUserAgent[] }) {
    this.visits = data.visits;
    this.topIps = data.topIps;
    this.topUserAgents = data.topUserAgents;
  }
}
