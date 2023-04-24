import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryDatabaseService<T> {
  private readonly data: T[];

  constructor() {
    this.data = [];
  }

  add(obj: T): void {
    this.data.push(obj);
  }

  findOneByProperty(prop: keyof T, value: unknown): T {
    return this.data.find((obj) => obj[prop] === value);
  }

  findAllByProperty(prop: keyof T, value: unknown): T[] {
    return this.data.filter((obj) => obj[prop] === value);
  }
}
