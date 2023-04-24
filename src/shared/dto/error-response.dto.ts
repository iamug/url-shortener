// import { ApiProperty } from '@nestjs/swagger';

class ErrorObject {
  // @ApiProperty({ description: 'error message can be a string or object' })
  message: string;
}

export class APIErrorResponse {
  // @ApiProperty({ example: 'error' })
  // status: string;

  success: false;

  // @ApiProperty({ description: 'error message can be a string or object', example : "error message can be a string or object" })
  message: string | object;
  timestamp: string;

  // @ApiProperty({ type: ErrorObject })
  // error: ErrorObject;
}
