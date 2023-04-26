import { Controller, Get, Post, Body, Param, BadRequestException, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { EncodeUrlDto } from './dto/encode-url.dto';
import { Request } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('encode')
  async encode(@Body() body: EncodeUrlDto) {
    return await this.urlService.encodeURL(body).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }

  @Get('decode/:id')
  async decode(@Param('id') shortId: string, @Req() req: Request) {
    return await this.urlService.decodeURL({ shortId, req }).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }

  @Get('statistics/:id')
  async statistics(@Param('id') shortId: string) {
    return await this.urlService.getStatisticsForShortId({ shortId }).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }
}
