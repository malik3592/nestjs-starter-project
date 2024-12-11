import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EncryptionsService } from './providers/encryptions.service';
import { DecryptDataDto } from './dtos/decrypt-data.dto';
import { EncryptDataDto } from './dtos/encrypt-data.dto'; // Import the new DTO
import { ResponseDto } from '../common/dtos/response';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';

@ApiTags('Encryption')
@Controller('encryptions')
export class EncryptionsController {
  constructor(private readonly encryptionsService: EncryptionsService) {}

  /**
   * To decrypt data.
   */
  @ApiOperation({ summary: 'API to decrypt data' })
  @Auth(AuthType.None)
  @Post('decrypt')
  decrypt(@Body() decryptDataDto: DecryptDataDto): ResponseDto<any> {
    return this.encryptionsService.decrypt(decryptDataDto);
  }

  /**
   * To encrypt data.
   */
  @ApiOperation({ summary: 'API to encrypt data' })
  @Auth(AuthType.None)
  @Post('encrypt')
  encrypt(@Body() encryptDataDto: EncryptDataDto): ResponseDto<any> {
    return this.encryptionsService.encrypt(encryptDataDto);
  }
}
