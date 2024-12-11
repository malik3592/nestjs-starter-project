// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserTypeEnum } from './enums/userType.enum';
import { Role } from '../roles/role.schema';

/**
 * Schema representing the User entity.
 * Includes properties like username, email, password, and user type.
 */
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) // The name of the user
  userName: string;

  @Prop({ required: true, unique: true }) // User's phone number (must be unique)
  phoneNumber: string;

  @Prop({ required: true, unique: true }) // User's email address (must be unique)
  email: string;

  @Prop({ required: true }) // Encrypted user password
  password: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
  }) // Type of user (RENTER/OWNER/ADMIN)
  userRoleId: Role;

  @Prop({ default: true }) // Active status of the user (default: true)
  active: boolean;

  @Prop({ default: null }) // Timestamp for when the user is marked as deleted
  deletedAt?: Date;
}

// Generate the Mongoose schema for the User model
export const UserSchema = SchemaFactory.createForClass(User);
