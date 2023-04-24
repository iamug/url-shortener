import { v4 as uuidv4 } from 'uuid';

export class Visits {
  id: string;

  shortId: string;

  ip: string;

  userAgent: string;

  referrer: string;

  visitDate: Date | string;

  constructor(data: Partial<Visits>) {
    this.id = data.id || uuidv4();
    this.shortId = data.shortId;
    this.ip = data.ip;
    this.userAgent = data.userAgent;
    this.visitDate = data.visitDate || new Date().toISOString();
  }
}
