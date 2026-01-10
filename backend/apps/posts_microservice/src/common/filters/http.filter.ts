import { ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Catch } from '@nestjs/common';
import { Response } from 'express';
import logger from '../../utils/logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    logger.error('HTTP EXCEPTION:', exception);
    response.status(status).json({
      success: false,
      status: status,
      message: exception.message || 'Internal server error',
    });
  }
}