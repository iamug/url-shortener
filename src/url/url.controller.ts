import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('encode')
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.encodeURL(createUrlDto as any);
  }

  @Get('decode/:id')
  async findOne(@Param('id') shortId: string) {
    return await this.urlService.decodeURL({ shortId }).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }
}
