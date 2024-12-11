// src/schemas/otp.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OTPType } from './enums/otp-type.enum';

/**
 * Schema representing an OTP entity.
 * Used for managing OTP generation and validation.
 */
@Schema({ timestamps: true })
export class OTP extends Document {
  @Prop({ required: true }) // User ID associated with the OTP
  userId: string;

  @Prop({ required: true, enum: OTPType }) // Type of OTP (EMAIL or PHONE)
  type: OTPType;

  @Prop({ required: true }) // The generated OTP value
  otp: string;

  @Prop({ required: true }) // Expiry timestamp for the OTP
  expireIn: Date;

  @Prop({ default: null }) // Timestamp for when the OTP was validated
  validatedAt?: Date;
}

// Generate Mongoose schema for OTP
export const OTPSchema = SchemaFactory.createForClass(OTP);
