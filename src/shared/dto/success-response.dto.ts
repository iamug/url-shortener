import { ApiProperty } from '@nestjs/swagger';

export class APISuccessResponse<TData = unknown> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  payload: TData;
}
