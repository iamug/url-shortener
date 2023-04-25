import { HttpException, HttpStatus } from '@nestjs/common';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { APIErrorResponse } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response<APIErrorResponse> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<APIErrorResponse>>();
    const exceptionResponse = exception instanceof HttpException ? (exception.getResponse() as any) : null;
    const exceptionStatus = exception instanceof HttpException ? exception.getStatus() : null;
    const status = exceptionResponse?.status || exceptionStatus || HttpStatus.EXPECTATION_FAILED;
    return response.status(status).json({
      success: false,
      message: exceptionResponse?.message || exceptionResponse || exception.message || 'The process failed',
      timestamp: new Date().toISOString(),
    });
  }
}
