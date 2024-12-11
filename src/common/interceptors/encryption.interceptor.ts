import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { decrypt, encrypt } from '../../utils/aes-encryption.util';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  constructor(
    private readonly isEncryptionActive: boolean,
    private readonly excludedPaths: string[] = [],
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    // Check if the path is excluded
    const url = req.url;
    if (this.excludedPaths.some((path) => url.startsWith(path))) {
      return next.handle(); // Skip interception
    }

    // Decrypt request body
    if (this.isEncryptionActive && req.body && 'cipher' in req.body) {
      try {
        req.body = decrypt(req.body.cipher);
      } catch (err) {
        throw new BadRequestException('Invalid encrypted payload');
      }
    }

    // Encrypt response body
    return next.handle().pipe(
      map((data) => {
        if (this.isEncryptionActive) {
          return { cipher: encrypt(data) };
        }
        return data;
      }),
      catchError((error) => {
        // Encrypt error response
        if (this.isEncryptionActive) {
          const status =
            error instanceof HttpException ? error.getStatus() : 500;
          const message =
            error instanceof HttpException
              ? error.getResponse()
              : { message: 'Internal Server Error' };

          const encryptedError = { cipher: encrypt({ status, message }) };

          return throwError(() => new HttpException(encryptedError, status));
        }

        // Pass through unencrypted error
        return throwError(() => error);
      }),
    );
  }
}
