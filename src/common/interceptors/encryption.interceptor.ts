import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey = 'your-secret-key-32chars-long';
  private readonly iv = 'your-initial-vector';

  constructor(private readonly isEncryptionActive: boolean) {}

  decrypt(text: string): any {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    let decrypted = decipher.update(text, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  encrypt(data: any): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Decrypt request body
    if (this.isEncryptionActive && req.body && 'chipher' in req.body) {
      try {
        req.body = this.decrypt(req.body.chipher);
      } catch (err) {
        throw new Error('Invalid encrypted payload');
      }
    }

    // Encrypt response body
    return next.handle().pipe(
      map((data) => {
        if (this.isEncryptionActive) {
          return { chipher: this.encrypt(data) };
        }
        return data;
      }),
    );
  }
}
