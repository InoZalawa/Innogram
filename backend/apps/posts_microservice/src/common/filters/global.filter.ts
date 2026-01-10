import { ExceptionFilter, ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import logger from '../../utils/logger';

@Catch() // gets all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    logger.error('CRITICAL SYSTEM ERROR:', exception);

    response.status(status).json({
      success: false,
      status: status,
      message: 'A critical system error occurred',
     });
  }
}