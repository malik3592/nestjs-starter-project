// src/dto/validate-otp.dto.ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OTPType } from '../enums/otp-type.enum';

/**
 * DTO for validating an OTP.
 */
export class ValidateOtpDto {
  @ApiProperty({
    example: 'USER_ID_123',
    description: 'The user ID associated with the OTP',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '123456', description: 'The OTP to be validated' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'EMAIL',
    enum: OTPType,
    description: 'The type of OTP (EMAIL or PHONE)',
  })
  @IsEnum(OTPType)
  @IsNotEmpty()
  type: OTPType;
}
