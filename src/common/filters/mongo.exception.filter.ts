import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';
import mongoose from 'mongoose';

@Catch(MongoError, mongoose.Error.StrictPopulateError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(
    exception: MongoError | mongoose.Error.StrictPopulateError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred';

    if (exception instanceof MongoError) {
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
    } else if (exception instanceof mongoose.Error.StrictPopulateError) {
      // Handle StrictPopulateError
      statusCode = HttpStatus.BAD_REQUEST;
      message = `Invalid populate path: '${exception.path}'. Please verify the schema and query.`;
    }

    response.status(statusCode).json({
      statusCode,
      error: 'MongoDB/Mongoose Error',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private getDuplicateKeyErrorMessage(exception: MongoError): string {
    const match = /index: (.+?) dup key: \{ (.+?): "(.+?)" \}/.exec(
      exception.message,
    );
    if (match) {
      const [, , field, value] = match;
      return `Duplicate value already: ${field} ${value} exists`;
    }
    return 'Duplicate key error occurred';
  }
}
