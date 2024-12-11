// src/dto/generate-otp.dto.ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OTPType } from '../enums/otp-type.enum';

/**
 * DTO for requesting OTP generation.
 */
export class GenerateOtpDto {
  @ApiProperty({
    example: 'USER_ID_123',
    description: 'The user ID for whom the OTP is generated',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'EMAIL',
    enum: OTPType,
    description: 'The type of OTP (EMAIL or PHONE)',
  })
  @IsEnum(OTPType)
  @IsNotEmpty()
  type: OTPType;
}
