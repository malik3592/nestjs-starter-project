import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey = 'your-secret-key-32chars-long'; // Must be 32 chars
  private readonly iv = 'your-initial-vector'; // Must be 16 chars
  private readonly encryptionEnabled = process.env.ENABLE_ENCRYPTION === 'true';

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

  use(req: Request, res: Response, next: NextFunction) {
    if (this.encryptionEnabled) {
      // Decrypt incoming request
      if (req.body && req.body.chipher) {
        try {
          const decryptedData = this.decrypt(req.body.chipher);
          req.body = decryptedData; // Set decrypted data to the request body
        } catch (err) {
          console.error('Decryption failed:', err.message);
          return res.status(400).json({ message: 'Invalid encrypted payload' });
        }
      }

      const originalSend = res.send;

      res.send = (body: any) => {
        if (body) {
          try {
            const encryptedResponse = { chipher: this.encrypt(body) };
            return originalSend.call(res, encryptedResponse);
          } catch (err) {
            console.error('Encryption failed:', err.message);
            return originalSend.call(res, {
              message: 'Response encryption failed',
            });
          }
        }
        return originalSend.call(res, body);
      };
    }

    next();
  }
}
