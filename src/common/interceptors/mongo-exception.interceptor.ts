import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

@Injectable()
export class MongoExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Default error message
        let message = 'An unexpected database error occurred';
        let statusCode = 500;

        // Handle MongoDB-specific errors
        if (error instanceof MongoError) {
          switch (error.code) {
            case 11000: // Duplicate key error
              const fieldName = this.extractDuplicateKeyMessage(error);
              statusCode = 409;
              message = `${fieldName} already exists. Please use a different value.`;
              break;
            case 121: // Document validation error
              statusCode = 400;
              message =
                'Document validation failed. Please ensure the data meets schema requirements.';
              break;
            default:
              message = error.message || message;
          }
        }

        // Handle Mongoose-specific errors
        else if (error instanceof MongooseError) {
          if (error instanceof MongooseError.ValidationError) {
            // Validation error
            statusCode = 400;
            message = `Validation error: ${error.message}`;
          } else if (error instanceof MongooseError.CastError) {
            // Invalid type or ObjectId
            statusCode = 400;
            message = `Invalid value for ${error.path}: ${error.value}. Expected type: ${error.kind}`;
          } else if (error instanceof MongooseError.StrictPopulateError) {
            // Invalid populate path
            statusCode = 400;
            message = `Invalid populate path: '${error.path}'. Please verify the schema and query.`;
          } else if (error.name === 'DisconnectedError') {
            // Database connection lost
            statusCode = 503;
            message = 'Database connection lost. Please try again later.';
          } else if (error.name === 'TimeoutError') {
            // Database query timeout
            statusCode = 504;
            message = 'Database request timed out. Please try again later.';
          } else {
            // Generic Mongoose error
            message = error.message || message;
          }
        } else {
          // Pass through any other unhandled errors
          return throwError(() => error);
        }

        // Return the formatted error response for handled exceptions
        return throwError(() => {
          switch (statusCode) {
            case 400:
              return new BadRequestException(message);
            case 409:
              return new ConflictException(message);
            case 503:
              return new ServiceUnavailableException(message);
            case 504:
              return new ServiceUnavailableException(message);
            default:
              return new InternalServerErrorException(message);
          }
        });
      }),
    );
  }

  /**
   * Extracts a user-friendly message from duplicate key errors.
   * @param error - The MongoError object.
   * @returns A formatted error message for duplicate key errors.
   */
  private extractDuplicateKeyMessage(error: MongoError): string {
    const match = /index: (.+?) dup key: \{ (.+?): "(.+?)" \}/.exec(
      error.message,
    );
    if (match) {
      const [, , field, value] = match;
      return `Duplicate value: ${field} '${value}'`;
    }
    return 'Duplicate key error occurred.';
  }
}
