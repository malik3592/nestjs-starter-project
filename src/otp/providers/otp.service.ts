// src/services/otp.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenerateOtpDto } from '../dto/generate-otp.dto';
import { ValidateOtpDto } from '../dto/validate-otp.dto';
import { OTP } from '../otp.schema';
import { OtpProvider } from './otp.provider';

/**
 * Service to handle OTP-related business logic.
 */
@Injectable()
export class OTPService {
  constructor(
    @InjectModel(OTP.name) private otpModel: Model<OTP>,
    private readonly otpProvider: OtpProvider,
  ) {}

  /**
   * Generates an OTP for a user.
   * @param generateOtpDto - DTO containing user ID and OTP type.
   * @returns The generated OTP document.
   */
  async generateOtp(generateOtpDto: GenerateOtpDto): Promise<OTP> {
    const { userId, type } = generateOtpDto;

    // expire OTP for the user and type if any
    await this.otpModel.findOneAndUpdate(
      {
        userId: generateOtpDto.userId,
        type: generateOtpDto.type,
        validatedAt: null,
        expireIn: { $gt: new Date() },
      },
      {
        expireIn: new Date(),
      },
    );

    // Generate a random 6-digit OTP
    const otpValue = this.otpProvider.createOTP();
    const expireIn = new Date();
    expireIn.setMinutes(expireIn.getMinutes() + 5); // OTP expires in 5 minutes

    // Save OTP in the database
    const otp = new this.otpModel({ userId, type, otp: otpValue, expireIn });
    return await otp.save();
  }

  /**
   * Validates an OTP for a user.
   * @param validateOtpDto - DTO containing OTP, user ID, and type.
   * @returns Validation result.
   */
  async validateOtp(validateOtpDto: ValidateOtpDto): Promise<boolean> {
    const { userId, otp, type } = validateOtpDto;

    // Find the OTP in the database
    const existingOtp = await this.otpModel.findOne({ userId, type, otp });
    if (!existingOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if the OTP is expired
    if (existingOtp.expireIn < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark the OTP as validated
    existingOtp.validatedAt = new Date();
    await existingOtp.save();
    return true;
  }
}
