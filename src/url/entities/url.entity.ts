import { v4 as uuidv4 } from 'uuid';

export class Url {
  id: string;

  shortId: string;

  longUrl: string;

  visits: number;

  lastVisisted: Date;

  createdAt: Date | string;

  updatedAt: Date | string;

  constructor(data: Partial<Url>) {
    this.id = data.id || uuidv4();
    this.shortId = data.shortId;
    this.longUrl = data.longUrl;
    this.visits = data.visits || 0;
    this.lastVisisted = data.lastVisisted;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
