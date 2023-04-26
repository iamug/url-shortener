import { Injectable } from '@nestjs/common';
import { MemoryDatabaseService } from 'src/shared/database/memory/memorydb.service';
import { Visits } from './entities/visits.entity';
import { getUniqueValuesAndCount, sortByProperty } from 'src/shared/utils/helper.utils';

@Injectable()
export class VisitsService {
  constructor(private readonly visitsDatabase: MemoryDatabaseService<Visits>) {
    this.visitsDatabase = new MemoryDatabaseService();
  }

  saveVisits(input: Record<'shortId' | 'ip' | 'userAgent' | 'referer', string>) {
    try {
      const newVisit = new Visits(input);
      this.visitsDatabase.add(newVisit);
    } catch (error) {
      throw new Error(error);
    }
  }

  getVisitsForShortId(shortId: string) {
    try {
      const shortIdVisits = this.visitsDatabase.findAllByProperty('shortId', shortId);
      return shortIdVisits;
    } catch (error) {
      throw new Error(error);
    }
  }

  getTopIpsAndUserAgentForShortId(shortId: string, size: number = 5) {
    try {
      const visits = this.getVisitsForShortId(shortId);
      const [groupIps, groupUserAgents] = [getUniqueValuesAndCount(visits, 'ip'), getUniqueValuesAndCount(visits, 'userAgent')];
      const ipsArray = Object.entries(groupIps).map(([key, value]) => ({ ip: key, count: value }));
      const topIps = sortByProperty(ipsArray, 'count', 'DESC').slice(0, size);
      const userAgentsArray = Object.entries(groupUserAgents).map(([key, value]) => ({ userAgent: key, count: value }));
      const topUserAgents = sortByProperty(userAgentsArray, 'count', 'DESC').slice(0, size);
      return {
        topIps,
        topUserAgents,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
