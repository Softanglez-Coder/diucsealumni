import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Transforms all HttpExceptions into RFC 7807 Problem Details responses.
 * Unhandled errors produce a 500 Internal Server Error without leaking internals.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let detail = 'An unexpected error occurred.';
    let title = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      title = exception.message;
      detail =
        typeof res === 'string'
          ? res
          : ((res as { message?: string | string[] }).message?.toString() ?? exception.message);
    } else {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      type: `https://csediualumni.com/errors/${title.toLowerCase().replaceAll(/\s+/g, '-')}`,
      title,
      status,
      detail,
      instance: request.url,
    });
  }
}
