import { Injectable } from '@nestjs/common';
import { DecryptDataDto } from '../dtos/decrypt-data.dto';
import { ResponseDto } from '../../common/dtos/response';
import { decrypt, encrypt } from '../../utils/aes-encryption.util';
import { EncryptDataDto } from '../dtos/encrypt-data.dto';

@Injectable()
export class EncryptionsService {
  decrypt(decryptDataDto: DecryptDataDto): ResponseDto<any> {
    const object = decrypt(decryptDataDto.cipher);
    return new ResponseDto<any>('Decrypted data', object);
  }

  encrypt(encryptDataDto: EncryptDataDto): ResponseDto<any> {
    const cipher = encrypt(encryptDataDto.data);
    return new ResponseDto<any>('Encrypted cipher text', cipher);
  }
}
