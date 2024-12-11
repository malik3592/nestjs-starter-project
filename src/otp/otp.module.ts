import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTP, OTPSchema } from './otp.schema';
import { OTPService } from './providers/otp.service';
import { OtpProvider } from './providers/otp.provider';

@Module({
  providers: [OTPService, OtpProvider],
  exports: [OTPService],
  imports: [
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]), // Register the OTP schema
  ],
})
export class OtpModule {}
