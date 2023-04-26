import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class EncodeUrlDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ description: 'valid url string' })
  url: string;
}
