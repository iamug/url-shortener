import { Controller, Get, Post, Body, Param, BadRequestException, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { EncodeUrlDto } from './dto/encode-url.dto';
import { Request } from 'express';
import { ErrorApiResponse, SuccessApiResponse, ValidationErrorApiResponse } from 'src/shared/decorators/swagger.decorator';
import { DecodeResponseDto, EncodeResponseDto, StatisticsResponseDto } from './dto/url-response.dto';

@ErrorApiResponse()
@ValidationErrorApiResponse()
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @SuccessApiResponse(EncodeResponseDto)
  @Post('encode')
  async encode(@Body() body: EncodeUrlDto): Promise<EncodeResponseDto> {
    return await this.urlService.encodeURL(body).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }

  @SuccessApiResponse(DecodeResponseDto)
  @Get('decode/:id')
  async decode(@Param('id') shortId: string, @Req() req: Request): Promise<DecodeResponseDto> {
    return await this.urlService.decodeURL({ shortId, req }).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }

  @SuccessApiResponse(StatisticsResponseDto)
  @Get('statistics/:id')
  async statistics(@Param('id') shortId: string): Promise<StatisticsResponseDto> {
    return await this.urlService.getStatisticsForShortId({ shortId }).catch((error) => {
      throw new BadRequestException(error, {
        cause: error,
      });
    });
  }
}
