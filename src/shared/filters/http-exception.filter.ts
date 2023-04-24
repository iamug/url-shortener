import { HttpException, HttpStatus } from '@nestjs/common';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { APIErrorResponse } from '../dto/error-response.dto';

/**
 * Exception Filter to catch HTTP Errors and format the response to the client
 */
@Catch()
export class HttpExceptionFilter {
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ): Response<APIErrorResponse> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<APIErrorResponse>>();
    const exceptionResponse = exception.getResponse() as any;
    const status =
      exceptionResponse?.status ||
      exception.getStatus() ||
      HttpStatus.EXPECTATION_FAILED;
    return response.status(status).json({
      success: false,
      message:
        exceptionResponse.message || exceptionResponse || 'The process failed',
      timestamp: new Date().toISOString(),
    });
  }
}
