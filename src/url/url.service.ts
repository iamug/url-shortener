import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { MemoryDatabaseService } from 'src/shared/database/memory/memorydb.service';
import { Url } from './entities/url.entity';
import { randomURLSafeCharacters } from 'src/shared/utils/helper.utils';

@Injectable()
export class UrlService {
  constructor(private readonly memoryDatabase: MemoryDatabaseService<Url>) {}

  private generateShortId(): string {
    const shortId = randomURLSafeCharacters(10);
    const shortIdExists = this.memoryDatabase.findOneByProperty(
      'shortId',
      shortId,
    );
    if (shortIdExists) {
      return this.generateShortId();
    }
    return shortId;
  }

  encodeURL(input: Record<'longUrl', string>) {
    try {
      const { longUrl } = input;
      const shortId = this.generateShortId();
      const newObject = new Url({ shortId, longUrl });
      this.memoryDatabase.add(newObject);
      return {
        shortId,
        longUrl,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  decodeURL(input: Record<'shortId', string>): Promise<Url | never> {
    try {
      const { shortId } = input;
      const shortIdData = this.memoryDatabase.findOneByProperty(
        'shortId',
        shortId,
      );
      if (!shortIdData)
        throw new NotFoundException('Short URL does not exist.');
      return Promise.resolve(shortIdData);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
