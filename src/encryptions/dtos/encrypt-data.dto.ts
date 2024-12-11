import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class EncryptDataDto {
  @ApiProperty({
    description: 'Data to be encrypted',
    example: { key: 'value' },
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}
