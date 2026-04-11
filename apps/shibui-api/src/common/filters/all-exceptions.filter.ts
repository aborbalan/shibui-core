import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  error: {
    statusCode: number;
    message: string | string[];
    code: string;
  };
  meta: {
    timestamp: string;
    path: string;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, code } = this.resolveException(exception);

    const body: ErrorResponse = {
      success: false,
      error: {
        statusCode,
        message,
        code,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    this.logger.error(
      `[${request.method}] ${request.url} → ${statusCode}: ${JSON.stringify(message)}`,
    );

    response.status(statusCode).json(body);
  }

  private resolveException(exception: unknown): {
    statusCode: number;
    message: string | string[];
    code: string;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // class-validator returns an object with a message array
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        return {
          statusCode,
          message: (exceptionResponse as { message: string | string[] })
            .message,
          code: exception.name,
        };
      }

      return {
        statusCode,
        message: exception.message,
        code: exception.name,
      };
    }

    // Unexpected / unhandled errors
    this.logger.error('Unhandled exception', exception);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    };
  }
}
