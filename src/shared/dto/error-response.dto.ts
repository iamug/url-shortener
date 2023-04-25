import { ApiProperty } from '@nestjs/swagger';

export class APIErrorResponse {
  @ApiProperty()
  success: false;

  @ApiProperty({ description: 'error message can be a string or object', example: 'error message can be a string or object' })
  message: string | object;

  @ApiProperty({ type: Date })
  timestamp: Date | string;
}
