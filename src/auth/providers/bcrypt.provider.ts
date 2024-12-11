import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    //generate salt
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
