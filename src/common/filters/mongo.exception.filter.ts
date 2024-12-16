import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred';

    // Handle specific MongoDB error codes
    switch (exception.code) {
      case 11000: // Duplicate key error
        statusCode = HttpStatus.CONFLICT;
        message = this.getDuplicateKeyErrorMessage(exception);
        break;
      case 121: // Validation error
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Document validation failed';
        break;
      default:
        message = exception.message || message;
    }

    response.status(statusCode).json({
      statusCode,
      error: 'MongoDB Error',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Extracts a human-readable message for duplicate key errors.
   */
  private getDuplicateKeyErrorMessage(exception: MongoError): string {
    const match = /index: (.+?) dup key: \{ (.+?): "(.+?)" \}/.exec(
      exception.message,
    );
    if (match) {
      const [, , field, value] = match;
      return `Duplicate value: ${field} ${value} already exists`;
    }
    return 'Duplicate key error occurred';
  }
}
