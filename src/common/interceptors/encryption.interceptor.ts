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
import { decrypt, encrypt } from 'src/utils/aes-encryption.util';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  constructor(private readonly isEncryptionActive: boolean) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Decrypt request body
    if (this.isEncryptionActive && req.body && 'chipher' in req.body) {
      try {
        req.body = decrypt(req.body.chipher);
      } catch (err) {
        throw new BadRequestException('Invalid encrypted payload');
      }
    }

    // Encrypt response body
    return next.handle().pipe(
      map((data) => {
        if (this.isEncryptionActive) {
          return { chipher: encrypt(data) };
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

          const encryptedError = { chipher: encrypt(message) };

          return throwError(() => new HttpException(encryptedError, status));
        }

        // Pass through unencrypted error
        return throwError(() => error);
      }),
    );
  }
}
