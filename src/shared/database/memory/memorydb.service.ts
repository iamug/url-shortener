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

  updateOneByProperty(query: { prop: keyof T; value: unknown }, data: Partial<T>): T {
    const { prop, value } = query;
    const existsIndex = this.data.findIndex((obj) => obj[prop] === value);
    if (existsIndex < 0) throw new Error('Item does not exist.');
    const updatedObject = { ...data, [prop]: value };
    this.data[existsIndex] = { ...this.data[existsIndex], ...updatedObject };
    return this.data[existsIndex];
  }

  findOneByProperty(prop: keyof T, value: unknown): T {
    return this.data.find((obj) => obj[prop] === value);
  }

  findAllByProperty(prop: keyof T, value: unknown): T[] {
    return this.data.filter((obj) => obj[prop] === value);
  }
}
