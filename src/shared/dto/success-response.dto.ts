import { ApiProperty } from '@nestjs/swagger';

export class APISuccessResponse<TData = unknown> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'The process completed successfully.' })
  message: string;

  @ApiProperty()
  data: TData;
}
